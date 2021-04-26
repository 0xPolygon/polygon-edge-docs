---
id: state 
title: State
---

To truly understand how **State** works, you must understand some basic Ethereum concepts.<br />

You can always skip ahead to the part where we dive into **[State](/docs/reference/state#overview)**.

## Ethereum Basics

### Merkle Trees

Before discussing the main data objects in Ethereum, we need to go over what Merkle trees are, and what are the
properties that make them useful.

A **Merkle tree** is a *tree* data structure, where the leaf nodes contain the hash of a block of data, and the non-leaf
nodes contain the hash of its children nodes.

![Example Merkle tree](/img/state/merkleTree.png)

In a Merkle tree, any change to the underlying data causes the hash of the node referring to the data to change. Since
each parent node hash depends on the data of its children, any change to the data of a child node causes the parent hash
to change. This happens to each parent node up to the root node. Therefore, any change to the data at the leaf nodes
causes the root node hash to change. From this, we can derive two important properties:

1. We don't need to compare all the data across the leaf nodes to know if they have the same data. We can just compare
   the root node hash.
2. If we want to prove that specific data is part of the tree, we can use a technique called Merkle proofs. We won't
   dive into details here but it is an easy and effective way to prove that a piece of data is in the Merkle tree.

The first property is important because it makes it possible to store only a hash of the root node to represent the data
at that point in time. This means we only need to store the root hash of the tree representing the block on the
blockchain (as opposed to storing all the data in the blockchain) and still keep the data immutable.

### World State

The **world state** is a mapping between **addresses** (accounts) and **account states**.

The world state is not stored on the blockchain, but the Yellow Paper states it is expected that implementations store
this data in a trie (also referred as the state database or state trie). The world state can be seen as the global state
that is constantly updated by transaction executions.

All the information about Ethereum accounts lives in the world state and is stored in the world state trie. If you want
to know the balance of an account, or the current state of a smart contract, you query the world state trie to retrieve
the account state of that account. We’ll describe how this data is stored shortly.

![World State](/img/state/worldState.png)

### Account State

In Ethereum, there are two types of accounts: **External Owned Accounts (EOA)** and **Contract Accounts**.

An EOA account is the account that regular users have, that they can use to send Ether to one another and deploy smart
contracts with.

A contract account is the account that is created when a smart contract is deployed. Every smart contract has its own
Ethereum account.

The account state contains information about an Ethereum account. For example, it stores how much Ether an account has,
and the number of transactions sent by the account. Each account has an ***account state***.

Let's take a look into each one of the fields in the account state:

* **nonce** - Number of transactions sent from this address (if this is an External Owned Account - EOA) or the number
  of contract-creations made by this account
* **balance** - Total Ether (in Wei) owned by this account
* **storageRoot** - Hash of the root node of the account storage trie
* **codeHash** - For contract accounts, hash of the EVM code of this account. For EOAs, this will be empty.

One important detail about the account state is that all fields (except the codeHash) are **mutable**. For example, when
one account sends some Ether to another, the nonce will be incremented, and the balance will be updated to reflect the
new balance.

One of the consequences of the codeHash being immutable is that if you deploy a contract with a bug, you can't update
the same contract. You need to deploy a new contract (the buggy version will be available forever). This is why it is
important to use tools like Truffle to develop and test your smart contracts and follow the best practices when working
with Solidity.

The Account Storage trie is where the data associated with an account is stored. This is only relevant for Contract
Accounts, as for EOAs the storageRoot is **empty**, and the codeHash is the hash of an empty string.

![Account State](/img/state/accountState.png)

### Transactions

Transactions are what makes the state change from the current state to the next state. In Ethereum, we have three types
of transactions:

1. Transactions that transfer value between two EOAs (e.g, change the sender and receiver account balances)
2. Transactions that send a message call to a contract (e.g, set a value in the smart contract by sending a message call
   that executes a setter method)
3. Transactions that deploy a contract (therefore, create an account, the contract account)

:::tip Clarification
Technically, **1** and **2** are the same - transactions that send message calls that affect an account state,
either EOA or contract accounts.

It is easier to think about them as three different types.
:::

These are the fields of a transaction:

* **nonce** - Number of transactions sent by the account that created the transaction
* **gasPrice** - Value (in Wei) that will be paid per unit of gas for the computation costs of executing this
  transaction
* **gasLimit** - Maximum amount of gas to be used while executing this transaction
* **to**
    * If this transaction is transferring Ether, address of the EOA account that will receive a value transfer
    * If this transaction is sending a message to a contract (e.g, calling a method in the smart contract), this is
      address of the contract
    * If this transaction is creating a contract, this value is always empty
* **value**
    * If this transaction is transferring Ether, amount in Wei that will be transferred to the recipient account
    * If this transaction is sending a message to a contract, amount of Wei payable by the smart contract receiving the
      message
    * If this transaction is creating a contract, this is the amount of Wei that will be added to the balance of the
      created contract
* **v, r, s** - Values used in the cryptographic signature of the transaction used to determine the sender of the
  transaction
* **data** (only for value transfer and sending a message call to a smart contract) -Input data of the message call (
  e.g, imagine you are trying to execute a setter method in your smart contract, the data field would contain the
  identifier of the setter method,and the value that should be passed as parameter)
* **init** (only for contract creation) - The EVM-code utilized for initialization of the contract

Not surprisingly, all transactions in a block are stored in a trie. <br/>The root hash of this trie is stored in the...
block header! Let's take a look into the anatomy of an Ethereum block.

### Blocks

The block header is divided in two parts, the **block header** and the **block body**.

The block header is the blockchain part of Ethereum. This is the structure that contains the hash of its predecessor
block (also known as parent block), building a cryptographically guaranteed chain.

The block body contains a list of transactions that have been included in this block, and a list of uncle (*ommer*)
block headers.

![Block Structure](/img/state/block.png)

The block header contains the following fields:

* **parentHash** - Hash of the block header from the previous block. Each block contains a hash of the previous block,
  all the way to the first block in the chain. This is how all the data is protected against modifications (any
  modification in a previous block would change the hash of all blocks after the modified block)
* **ommersHash** - Hash of the uncle blocks headers part of the block body
* **beneficiary** - Ethereum account that will get fees for mining this block
* **stateRoot** - Hash of the root node of the world state trie (after all transactions are executed)
* **transactionsRoot** - Hash of the root node of the transactions trie. This trie contains all transactions in the
  block body
* **receiptsRoot** - Every time a transactions is executed, Ethereum generates a transaction receipt that contains
  information about the transaction execution. This field is the hash of the root node of the transactions receipt trie
* **logsBloom** - Bloom filter that can be used to find out if logs were generated on transactions in this block (if you
  want more details check this Stack Overflow answer). This avoids storing of logs in the block (saving a lot of space)
* **difficulty** - Difficulty level of this block. This is a measure of how hard it was to mine this block (I'm not
  diving into the details of how this is calculated in this post)
* **number** - Number of ancestor blocks. This represents the height of the chain (how many blocks are in the chain).
  The genesis block has number zero
* **gasLimit** - Each transaction consumes gas. The gas limit specifies the maximum gas that can be used by the
  transactions included in the block. It is a way to limit the number of transactions in a block
* **gasUsed** - Sum of the gas cost of each transaction in the block
* **timestamp** - Unix timestamp when the block was created. Note that due to the decentralized nature of Ethereum, we
  can't trust in this value (specially when implementing smart contracts that have time related business logic)
* **extraData** - Arbitrary byte array that can contain anything. When a miner is creating the block, it can choose to
  add anything in this field
* **mixHash** - Hash used to verify that a block has been mined properly (if you want to really understand this, read
  about the Ethash proof-of-work function)
* **nonce** - Same as the mixHash, this value is used to verify that a block has been mined properly

### Recap

Ethereum has 4 types of tries:

1. The world state trie contains the mapping between addresses and account states. The hash of the root node of the
   world state trie is included in a block (in the stateRoot field) to represent the current state when that block was
   created. We only have one world state trie
2. The account storage trie contains the data associated to a smart contract. The hash of the root node of the Account
   storage trie is included in the sccount state (in the storageRoot field). We have one Account storage trie for each
   account
3. The transaction trie contains all the transactions included in a block. The hash of the root node of the Transaction
   trie is included in the block header (in the transactionsRoot field). We have one transaction trie per block
4. The transaction receipt trie contains all the transaction receipts for the transactions included in a block. The hash
   of the root node of the transaction receipts trie is included in also included in the block header (in the
   receiptsRoot field); We have one transaction receipts trie per block

Objects covered:

1. **World state**: the hard drive of the distributed computer that is Ethereum. It is a mapping between addresses and
   account states
2. **Account state**: stores the state of each one of Ethereum's accounts. It also contains the storageRoot of the
   account state trie, that contains the storage data for the account
3. **Transaction**: represents a state transition in the system. It can be a funds transfer, a message call or a
   contract deployment
4. **Block**: contains the link to the previous block (parentHash) and contains a group of transactions that, when
   executed, will yield the new state of the system. It also contains the stateRoot, the transactionRoot and the
   receiptsRoot, the hash of the root nodes of the world state trie, the transaction trie and the transaction receipts
   trie, respectively

![Main Diagram](/img/state/mainDiagram.png)

## Overview

Now that we've familiarized ourselves with basic Ethereum concepts, the next overview should be easy.

We mentioned that the **World state trie** has all the Ethereum accounts that exist. <br />
These accounts are the leaves of the Merkle trie. Each leaf has encoded **Account State** information.

This enables the Polygon SDK to get a specific Merkle trie, for a specific point in time. <br />
For example, we can get the hash of the state at block 10.

The Merkle trie, at any point in time, is called a ***Snapshot***.

We can have ***Snapshots*** for the **state trie**, or for the **storage trie** - they are basically the same. <br />
The only difference is in what the leaves represent:

* In the case of the storage trie, the leaves contain arbitrary state, which we cannot process or know what's in there
* In the case of the state trie, the leaves represent accounts

````go title="state/state.go
type State interface {
    // Gets a snapshot for a specific hash
	NewSnapshotAt(types.Hash) (Snapshot, error)
	
	// Gets the latest snapshot
	NewSnapshot() Snapshot
	
	// Gets the codeHash
	GetCode(hash types.Hash) ([]byte, bool)
}
````

The **Snapshot** interface is defined as such:

````go title="state/state.go
type Snapshot interface {
    // Gets a specific value for a leaf
	Get(k []byte) ([]byte, bool)
	
	// Commits new information
	Commit(objs []*Object) (Snapshot, []byte)
}
````

The information that can be committed is defined by the *Object struct*:

````go title="state/state.go
// Object is the serialization of the radix object
type Object struct {
	Address  types.Address
	CodeHash types.Hash
	Balance  *big.Int
	Root     types.Hash
	Nonce    uint64
	Deleted  bool

	DirtyCode bool
	Code      []byte

	Storage []*StorageObject
}
````

The implementation for the Merkle trie is in the *state/immutable-trie* folder. <br/>
*state/immutable-trie/state.go* implements the **State** interface.

*state/immutable-trie/trie.go* is the main Merkle trie object. It represents an optimized version of the Merkle trie,
which reuses as much memory as possible.

## Executor

*state/executor.go* includes all the information needed for the Polygon SDK to decide how a block changes the current
state. The implementation of *ProcessBlock* is located here.

The *apply* method does the actual state transition. The executor calls the EVM.

````go title="state/executor.go"
func (t *Transition) apply(msg *types.Transaction) ([]byte, uint64, bool, error) {
	// check if there is enough gas in the pool
	if err := t.subGasPool(msg.Gas); err != nil {
		return nil, 0, false, err
	}

	txn := t.state
	s := txn.Snapshot()

	gas, err := t.preCheck(msg)
	if err != nil {
		return nil, 0, false, err
	}
	if gas > msg.Gas {
		return nil, 0, false, errorVMOutOfGas
	}

	gasPrice := new(big.Int).SetBytes(msg.GetGasPrice())
	value := new(big.Int).SetBytes(msg.Value)

	// Set the specific transaction fields in the context
	t.ctx.GasPrice = types.BytesToHash(msg.GetGasPrice())
	t.ctx.Origin = msg.From

	var subErr error
	var gasLeft uint64
	var returnValue []byte

	if msg.IsContractCreation() {
		_, gasLeft, subErr = t.Create2(msg.From, msg.Input, value, gas)
	} else {
		txn.IncrNonce(msg.From)
		returnValue, gasLeft, subErr = t.Call2(msg.From, *msg.To, msg.Input, value, gas)
	}
	
	if subErr != nil {
		if subErr == runtime.ErrNotEnoughFunds {
			txn.RevertToSnapshot(s)
			return nil, 0, false, subErr
		}
	}

	gasUsed := msg.Gas - gasLeft
	refund := gasUsed / 2
	if refund > txn.GetRefund() {
		refund = txn.GetRefund()
	}

	gasLeft += refund
	gasUsed -= refund

	// refund the sender
	remaining := new(big.Int).Mul(new(big.Int).SetUint64(gasLeft), gasPrice)
	txn.AddBalance(msg.From, remaining)

	// pay the coinbase
	coinbaseFee := new(big.Int).Mul(new(big.Int).SetUint64(gasUsed), gasPrice)
	txn.AddBalance(t.ctx.Coinbase, coinbaseFee)

	// return gas to the pool
	t.addGasPool(gasLeft)

	return returnValue, gasUsed, subErr != nil, nil
}
````

## Runtime

When a state transition is executed, the main module that executes the state transition is the EVM (located in
state/runtime/evm).

The **dispatch table** does a match between the **opcode** and the instruction.

````go title="state/runtime/evm/dispatch_table.go"
func init() {
	// unsigned arithmetic operations
	register(STOP, handler{opStop, 0, 0})
	register(ADD, handler{opAdd, 2, 3})
	register(SUB, handler{opSub, 2, 3})
	register(MUL, handler{opMul, 2, 5})
	register(DIV, handler{opDiv, 2, 5})
	register(SDIV, handler{opSDiv, 2, 5})
	register(MOD, handler{opMod, 2, 5})
	register(SMOD, handler{opSMod, 2, 5})
	register(EXP, handler{opExp, 2, 10})

	...

	// jumps
	register(JUMP, handler{opJump, 1, 8})
	register(JUMPI, handler{opJumpi, 2, 10})
	register(JUMPDEST, handler{opJumpDest, 0, 1})
}
````

The core logic that powers the EVM is the *Run* loop. <br />

This is the main entry point for the EVM. It does a loop and checks the current opcode, fetches the instruction, checks
if it can be executed, consumes gas and executes the instruction until it either fails or stops.

````go title="state/runtime/evm/state.go"

// Run executes the virtual machine
func (c *state) Run() ([]byte, error) {
	var vmerr error

	codeSize := len(c.code)
	
	for !c.stop {
		if c.ip >= codeSize {
			c.halt()
			break
		}

		op := OpCode(c.code[c.ip])

		inst := dispatchTable[op]
		
		if inst.inst == nil {
			c.exit(errOpCodeNotFound)
			break
		}
		
		// check if the depth of the stack is enough for the instruction
		if c.sp < inst.stack {
			c.exit(errStackUnderflow)
			break
		}
		
		// consume the gas of the instruction
		if !c.consumeGas(inst.gas) {
			c.exit(errOutOfGas)
			break
		}

		// execute the instruction
		inst.inst(c)

		// check if stack size exceeds the max size
		if c.sp > stackSize {
			c.exit(errStackOverflow)
			break
		}
		
		c.ip++
	}

	if err := c.err; err != nil {
		vmerr = err
	}
	
	return c.ret, vmerr
}
````

## 📜 Resources
* **[Merkle Trees](https://brilliant.org/wiki/merkle-tree/)**
* **[Merkle Proofs](https://medium.com/crypto-0-nite/merkle-proofs-explained-6dd429623dc5)**
* **[How is data stored in Ethereum?](https://hackernoon.com/getting-deep-into-ethereum-how-data-is-stored-in-ethereum-e3f669d96033)**
* **[Diving into Ethereum's world state](https://medium.com/cybermiles/diving-into-ethereums-world-state-c893102030ed)**
* **[How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)**
* **[A (Practical) Walkthrough of Smart Contract Storage](https://medium.com/coinmonks/a-practical-walkthrough-smart-contract-storage-d3383360ea1b)**
* **[Inside an Ethereum transaction](https://medium.com/@codetractio/inside-an-ethereum-transaction-fa94ffca912f)**
* **[Life Cycle of an Ethereum Transaction](https://medium.com/blockchannel/life-cycle-of-an-ethereum-transaction-e5c66bae0f6e)**
* **[Ethereum Design Rationale](https://github.com/ethereum/wiki/wiki/Design-Rationale)**