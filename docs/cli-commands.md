---
id: cli-commands
title: CLI Commands
---

This section details the present commands, command flags in the Polygon SDK, and how they're used.

## 🚀 Startup Commands

| **Command** | **Description**                                                                                                                                      |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| server      | The default command that starts the blockchain client, by bootstrapping all modules together                                                         |
| dev         | "Bypasses" consensus and networking and starts a blockchain locally. It starts a local node and mines every transaction in a separate block    |
| genesis     | Generates a *genesis.json* file, which is used to set predefined chain state before starting the client. The structure of the genesis file is described below |


## 👷 Operator Commands

### Peer Commands

| **Command**            | **Description**                                                                     |
|------------------------|-------------------------------------------------------------------------------------|
| peers add   | Adds a new peer using their libp2p address                                  |
| peers list             | Lists all the peers the client is connected to through libp2p                      |
| peers status | Returns the status of a specific peer from the peers list, using the libp2p address 

### IBFT Commands

| **Command**            | **Description**                                                                     |
|------------------------|-------------------------------------------------------------------------------------|
| ibft init   | Initializes IBFT for the Polygon SDK                              |
| ibft snapshot             | Returns the IBFT snapshot                    |
| ibft candidates  | Queries the current set of proposed candidates, as well as candidates that have not been included yet |
| ibft propose                | Proposes a new candidate to be added / removed from the validator set        |
| ibft status                | Returns the overall status of the IBFT client   


### Transaction Pool Commands

| **Command**            | **Description**                                                                     |
|------------------------|-------------------------------------------------------------------------------------|
| txpool add    | Adds a transaction to the transaction pool, using different flags                               |
| txpool status             | Returns the number of transactions in the pool                    

### Blockchain commands

| **Command**            | **Description**                                                                     |
|------------------------|-------------------------------------------------------------------------------------|
| status                 | Returns the status of the client. The detailed response can be found below          |
| monitor                | Subscribes to a blockchain event stream. The detailed response can be found below   |
| version                | Returns the current version of the client

## Responses

### Status Response

The response object is defined using Protocol Buffers.
````go title="minimal/proto/system.proto"
message ServerStatus {
    int64 network = 1;
    
    string genesis = 2;

    Block current = 3;

    string p2pAddr = 4;
    
    message Block {
        int64 number = 1;
        string hash = 2;
    }
}
````

### Monitor Response
````go title="minimal/proto/system.proto"
message BlockchainEvent {
    // The "repeated" keyword indicates an array
    repeated Header added = 1;
    repeated Header removed = 2;

    message Header {
        int64 number = 1;
        string hash = 2;
    }
}
````

## Genesis Template
The genesis file should be used to set the initial state of the blockchain (ex. if some accounts should have a starting balance).

The following *./genesis.json* file is generated:
````json
{
    "name": "example",
    "genesis": {
        "nonce": "0x0000000000000000",
        "gasLimit": "0x0000000000001388",
        "difficulty": "0x0000000000000001",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    "params": {
        "forks": {},
        "chainID": 100,
        "engine": {
            "pow": {}
        }
    },
    "bootnodes": []
}
````

### Data Directory

When executing the *data-dir* flag, a **test-chain** folder is generated.
The folder structure consists of the following sub-folders:
* **blockchain** - Stores the LevelDB for blockchain objects
* **trie** - Stores the LevelDB for the Merkle tries
* **keystore** - Stores private keys for the client. This includes the libp2p private key, and the sealing / validator private key
* **consensus** - Stores any consensus information that the client might need while working

## 📜 Resources
* **[Protocol Buffers](https://developers.google.com/protocol-buffers)**