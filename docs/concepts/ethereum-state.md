---
id: ethereum-state
title: State in Ethereum
---

## Merkle Trees

Before discussing the main data objects in Ethereum, we need to go over what Merkle trees are, and what are the
properties that make them useful.

A **Merkle tree** is a *tree* data structure, where the leaf nodes contain the hash of a block of data and the non-leaf
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

## World State

The **world state** is a mapping between **addresses** (accounts) and **account states**.

The world state is not stored on the blockchain, but the Yellow Paper states it is expected that implementations store
this data in a trie (also referred to as the state database or state trie). The world state can be seen as the global state
that is constantly updated by transaction executions.

All the information about Ethereum accounts lives in the world state and is stored in the world state trie. If you want
to know the balance of an account, or the current state of a smart contract, you query the world state trie to retrieve
the account state of that account. We’ll describe how this data is stored shortly.

![World State](/img/state/worldState.png)

## Account State

In Ethereum, there are two types of accounts: **External Owned Accounts (EOA)** and **Contract Accounts**.

An EOA account is an account that regular users have, that they can use to send Ether to one another and deploy smart
contracts with.

A contract account is an account that is created when a smart contract is deployed. Every smart contract has its own
Ethereum account.

The account state contains information about an Ethereum account. For example, it stores how much Ether an account has,
and the number of transactions sent by the account. Each account has an ***account state***.

Let's take a look into each one of the fields in the account state:

* **nonce** - Number of transactions sent from this address (if this is an External Owned Account - EOA) or the number
  of contract creations made by this account
* **balance** - Total Ether (in Wei) owned by this account
* **storageRoot** - Hash of the root node of the account storage trie
* **codeHash** - For contract accounts, the hash of the EVM code of this account. For EOAs, this will be empty.

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

## Transactions

Transactions are what make the state change from the current state to the next state. In Ethereum, we have three types
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
    * If this transaction is transferring Ether, the address of the EOA account that will receive a value transfer
    * If this transaction is sending a message to a contract (e.g, calling a method in the smart contract), this is
      address of the contract
    * If this transaction is creating a contract, this value is always empty
* **value**
    * If this transaction is transferring Ether, the amount in Wei that will be transferred to the recipient account
    * If this transaction is sending a message to a contract, the amount of Wei payable by the smart contract receiving the
      message
    * If this transaction is creating a contract, this is the amount of Wei that will be added to the balance of the
      created contract
* **v, r, s** - Values used in the cryptographic signature of the transaction used to determine the sender of the
  transaction
* **data** (only for value transfer and sending a message call to a smart contract) -Input data of the message call (
  e.g, imagine you are trying to execute a setter method in your smart contract, the data field would contain the
  identifier of the setter method, and the value that should be passed as a parameter)
* **init** (only for contract creation) - The EVM-code utilized for initialization of the contract

Not surprisingly, all transactions in a block are stored in a trie. <br/>The root hash of this trie is stored in the...
block header! Let's take a look into the anatomy of an Ethereum block.

## Blocks

The block header is divided into two parts, the **block header** and the **block body**.

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
* **receiptsRoot** - Every time a transaction is executed, Ethereum generates a transaction receipt that contains
  information about the transaction execution. This field is the hash of the root node of the transactions receipt trie
* **logsBloom** - Bloom filter that can be used to find out if logs were generated on transactions in this block (if you
  want more details check this Stack Overflow answer). This avoids storing logs in the block (saving a lot of space)
* **difficulty** - Difficulty level of this block. This is a measure of how hard it was to mine this block (I'm not
  diving into the details of how this is calculated in this post)
* **number** - Number of ancestor blocks. This represents the height of the chain (how many blocks are in the chain).
  The genesis block has number zero
* **gasLimit** - Each transaction consumes gas. The gas limit specifies the maximum gas that can be used by the
  transactions included in the block. It is a way to limit the number of transactions in a block
* **gasUsed** - Sum of the gas cost of each transaction in the block
* **timestamp** - Unix timestamp when the block was created. Note that due to the decentralized nature of Ethereum, we
  can't trust in this value (especially when implementing smart contracts that have time-related business logic)
* **extraData** - Arbitrary byte array that can contain anything. When a miner is creating the block, it can choose to
  add anything in this field
* **mixHash** - Hash used to verify that a block has been mined properly (if you want to really understand this, read
  about the Ethash proof-of-work function)
* **nonce** - Same as the mixHash, this value is used to verify that a block has been mined properly

## Recap

Ethereum has 4 types of tries:

1. The world state trie contains the mapping between addresses and account states. The hash of the root node of the
   world state trie is included in a block (in the stateRoot field) to represent the current state when that block was
   created. We only have one world state trie
2. The account storage trie contains the data associated with a smart contract. The hash of the root node of the Account
   storage trie is included in the account state (in the storageRoot field). We have one Account storage trie for each
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
   account state trie, which contains the storage data for the account
3. **Transaction**: represents a state transition in the system. It can be a funds transfer, a message call, or a
   contract deployment
4. **Block**: contains the link to the previous block (parentHash) and contains a group of transactions that, when
   executed, will yield the new state of the system. It also contains the stateRoot, the transactionRoot and the
   receiptsRoot, the hash of the root nodes of the world state trie, the transaction trie, and the transaction receipts
   trie, respectively

![Main Diagram](/img/state/mainDiagram.png)

## Credits

This clear and concise walkthrough of Ethereum's yellow paper was originally posted by Lucas Saldanha, 
on [his personal blog](https://www.lucassaldanha.com/author/lucas-saldanha/).

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
