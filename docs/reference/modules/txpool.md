---
id: txpool 
title: TxPool
---

## Overview

The TxPool module represents the transaction pool implementation, where transactions are added from different parts of
the system. The module also exposes several useful features for node operators, which are covered below.

## Operator Commands

````go title="txpool/proto/operator.proto
service TxnPoolOperator {
    // Status returns the current status of the pool
    rpc Status(google.protobuf.Empty) returns (TxnPoolStatusResp);

    // AddTxn adds a local transaction to the pool
    rpc AddTxn(AddTxnReq) returns (google.protobuf.Empty);

    // Subscribe subscribes for new events in the txpool
    rpc Subscribe(google.protobuf.Empty) returns (stream TxPoolEvent);
}

````

Node operators can query these GRPC endpoints, as described in the **[CLI Commands](/docs/cli-commands#transaction-pool-commands)** section.

## Processing Transactions

````go title="txpool/txpool.go"
// AddTx adds a new transaction to the pool
func (t *TxPool) AddTx(tx *types.Transaction) error {
	if err := t.addImpl("addTxn", tx); err != nil {
		return err
	}

	// broadcast the transaction only if network is enabled
	// and we are not in dev mode
	if t.topic != nil && !t.dev {
		txn := &proto.Txn{
			Raw: &any.Any{
				Value: tx.MarshalRLP(),
			},
		}
		if err := t.topic.Publish(txn); err != nil {
			t.logger.Error("failed to topic txn", "err", err)
		}
	}

	if t.NotifyCh != nil {
		select {
		case t.NotifyCh <- struct{}{}:
		default:
		}
	}
	return nil
}

func (t *TxPool) addImpl(ctx string, txns ...*types.Transaction) error {
	if len(txns) == 0 {
		return nil
	}

	from := txns[0].From
	for _, txn := range txns {
		// Since this is a single point of inclusion for new transactions both
		// to the promoted queue and pending queue we use this point to calculate the hash
		txn.ComputeHash()

		err := t.validateTx(txn)
		if err != nil {
			return err
		}

		if txn.From == types.ZeroAddress {
			txn.From, err = t.signer.Sender(txn)
			if err != nil {
				return fmt.Errorf("invalid sender")
			}
			from = txn.From
		} else {
			// only if we are in dev mode we can accept
			// a transaction without validation
			if !t.dev {
				return fmt.Errorf("cannot accept non-encrypted txn")
			}
		}

		t.logger.Debug("add txn", "ctx", ctx, "hash", txn.Hash, "from", from)
	}

	txnsQueue, ok := t.queue[from]
	if !ok {
		stateRoot := t.store.Header().StateRoot

		// initialize the txn queue for the account
		txnsQueue = newTxQueue()
		txnsQueue.nextNonce = t.store.GetNonce(stateRoot, from)
		t.queue[from] = txnsQueue
	}
	for _, txn := range txns {
		txnsQueue.Add(txn)
	}

	for _, promoted := range txnsQueue.Promote() {
		t.sorted.Push(promoted)
	}
	return nil
}
````
The ***addImpl*** method is the bread and butter of the **TxPool** module. 
It is the central place where transactions are added in the system, being called from the GRPC service, JSON RPC endpoints,
and whenever the client receives a transaction through the **gossip** protocol.

It takes in as an argument **ctx**, which just denotes the context from which the transactions are being added (GRPC, JSON RPC...). <br />
The other parameter is the list of transactions to be added to the pool.

The key thing to note here is the check for the **From** field within the transaction:
* If the **From** field is **empty**, it is regarded as an unencrypted / unsigned transaction. These kinds of transactions are only
accepted in development mode
* If the **From** field is **not empty**, that means that it's a signed transaction, so signature verification takes place

After all these validations, the transactions are considered to be valid.

## Data structures

````go title="txpool/txpool.go"
// TxPool is a pool of transactions
type TxPool struct {
	logger hclog.Logger
	signer signer

	store      store
	idlePeriod time.Duration

	queue map[types.Address]*txQueue
	sorted *txPriceHeap

	// network stack
	network *network.Server
	topic   *network.Topic

	sealing  bool
	dev      bool
	NotifyCh chan struct{}

	proto.UnimplementedTxnPoolOperatorServer
}
````

The fields in the TxPool object that can cause confusion are the **queue** and **sorted** lists.
* **queue** - Heap implementation of a sorted list of account transactions (by nonce)
* **sorted** - Sorted list for all the current promoted transactions (all executable transactions). Sorted by gas price

## Gas limit error management

Whenever you submit a transaction, there are three ways it can be processed by the TxPool.

1. All pending transactions can fit in a block
2. One or more pending transactions can not fit in a block
3. One or more pending transactions will never fit in a block

Here, the word **_fit_** means that the transaction has a gas limit that is lower than the remaining gas in the TxPool.

The first scenario does not produce any error.

### Second scenario

- The TxPool remaining gas is set to the gas limit of the last block, lets say **5000**
- A first transaction is processed and consumes **3000** gas of the TxPool
  - The remaining gas of the TxPool is now **2000**
- A second transaction, which is the same as the first one - they both consume 3000 units of gas, is submitted
- Since the remaining gas of the TxPool is **lower** than the transaction gas, it cannot be processed in the current 
  block
  - It is put back into a pending transaction queue so that it can be processed in the next block
- The first block is written, lets call it **block #1**
- The TxPool remaining gas is set to the parent block - **block #1**'s gas limit
- The transaction which was put back into the TxPool pending transaction queue is now processed and written in the block
  - The TxPool remaining gas is now **2000**
- The second block is written
- ...

### Third scenario
- The TxPool remaining gas is set to the gas limit of the last block, lets say **5000**
- A first transaction is processed and consumes **3000** gas of the TxPool
    - The remaining gas of the TxPool is now **2000**
- A second transaction, with a gas field set to **6000** is submitted
- Since the block gas limit is **lower** than the transaction gas, this transaction is discarded
    - It will never be able to fit in a block
- The first block is written
- ...

> This happens whenever you get the following error:
> ```shell
> 2021-11-04T15:41:07.665+0100 [ERROR] polygon.consensus.dev: failed to write transaction: transaction's gas limit exceeds block gas limit
> ```