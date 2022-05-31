---
id: blockchain
title: Blockchain
---

## Overview

One of the main modules of the Polygon Edge are **Blockchain** and **State**. <br />

**Blockchain** is the powerhouse that deals with block reorganizations. This means that it deals with all the logic that happens when a new block is included in the blockchain.

**State** represents the *state transition* object. It deals with how the state changes when a new block is included. <br /> Among other things, **State** handles:
* Executing transactions
* Executing the EVM
* Changing the Merkle tries
* Much more, which is covered in the corresponding **State** section 🙂

The key takeaway is that these 2 parts are very connected, and they work closely together in order for the client to function. <br /> For example, when the **Blockchain** layer receives a new block (and no reorganization occurred), it calls the **State** to perform a state transition.

**Blockchain** also has to deal with some parts relating to consensus (ex. *is this ethHash correct?*, *is this PoW correct?*). <br /> In one sentence, **it is the main core of logic through which all blocks are included**.

## *WriteBlocks*

One of the most important parts relating to the **Blockchain** layer is the *WriteBlocks* method:

````go title="blockchain/blockchain.go"
// WriteBlocks writes a batch of blocks
func (b *Blockchain) WriteBlocks(blocks []*types.Block) error {
	if len(blocks) == 0 {
		return fmt.Errorf("no headers found to insert")
	}

	parent, ok := b.readHeader(blocks[0].ParentHash())
	if !ok {
		return fmt.Errorf("parent of %s (%d) not found: %s", blocks[0].Hash().String(), blocks[0].Number(), blocks[0].ParentHash())
	}

	// validate chain
	for i := 0; i < len(blocks); i++ {
		block := blocks[i]

		if block.Number()-1 != parent.Number {
			return fmt.Errorf("number sequence not correct at %d, %d and %d", i, block.Number(), parent.Number)
		}
		if block.ParentHash() != parent.Hash {
			return fmt.Errorf("parent hash not correct")
		}
		if err := b.consensus.VerifyHeader(parent, block.Header, false, true); err != nil {
			return fmt.Errorf("failed to verify the header: %v", err)
		}

		// verify body data
		if hash := buildroot.CalculateUncleRoot(block.Uncles); hash != block.Header.Sha3Uncles {
			return fmt.Errorf("uncle root hash mismatch: have %s, want %s", hash, block.Header.Sha3Uncles)
		}
		
		if hash := buildroot.CalculateTransactionsRoot(block.Transactions); hash != block.Header.TxRoot {
			return fmt.Errorf("transaction root hash mismatch: have %s, want %s", hash, block.Header.TxRoot)
		}
		parent = block.Header
	}

	// Write chain
	for indx, block := range blocks {
		header := block.Header

		body := block.Body()
		if err := b.db.WriteBody(header.Hash, block.Body()); err != nil {
			return err
		}
		b.bodiesCache.Add(header.Hash, body)

		// Verify uncles. It requires to have the bodies on memory
		if err := b.VerifyUncles(block); err != nil {
			return err
		}
		// Process and validate the block
		if err := b.processBlock(blocks[indx]); err != nil {
			return err
		}

		// Write the header to the chain
		evnt := &Event{}
		if err := b.writeHeaderImpl(evnt, header); err != nil {
			return err
		}
		b.dispatchEvent(evnt)

		// Update the average gas price
		b.UpdateGasPriceAvg(new(big.Int).SetUint64(header.GasUsed))
	}

	return nil
}
````
The *WriteBlocks* method is the entry point to write blocks into the blockchain. As a parameter, it takes in a range of blocks.<br />
Firstly, the blocks are validated. After that, they are written to the chain.

The actual *state transition* is performed by calling the *processBlock* method within *WriteBlocks*.

It is worth mentioning that, because it is the entry point for writing blocks to the blockchain, other modules (such as the **Sealer**) utilize this method.

## Blockchain Subscriptions

There needs to be a way to monitor blockchain-related changes. <br />
This is where **Subscriptions** come in. 

Subscriptions are a way to tap into blockchain event streams and instantly receive meaningful data.

````go title="blockchain/subscription.go"
type Subscription interface {
    // Returns a Blockchain Event channel
	GetEventCh() chan *Event
	
	// Returns the latest event (blocking)
	GetEvent() *Event
	
	// Closes the subscription
	Close()
}
````

The **Blockchain Events** contain information regarding any changes made to the actual chain. This includes reorganizations, as well as new blocks:

````go title="blockchain/subscription.go"
type Event struct {
	// Old chain removed if there was a reorg
	OldChain []*types.Header

	// New part of the chain (or a fork)
	NewChain []*types.Header

	// Difficulty is the new difficulty created with this event
	Difficulty *big.Int

	// Type is the type of event
	Type EventType

	// Source is the source that generated the blocks for the event
	// right now it can be either the Sealer or the Syncer. TODO
	Source string
}
````

:::tip Refresher
Do you remember when we mentioned the ***monitor*** command in the [CLI Commands](/docs/get-started/cli-commands)?

The Blockchain Events are the original events that happen in Polygon Edge, and they're later mapped to a Protocol Buffers message format for easy transfer.
:::