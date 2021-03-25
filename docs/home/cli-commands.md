---
id: cli-commands
title: CLI Commands
---

This section details the present commands, command flags in the Polygon SDK, and how they're used.

## 🚀 Startup Commands

| **Command** | **Description**                                                                                                                                      |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| server      | The default command that starts the blockchain client, by bootstrapping all modules together                                                         |
| dev         | ⚠️WIP. "Bypasses" consensus and networking and starts a blockchain locally. It starts a local node and mines every transaction in a separate block    |
| genesis     | Generates a *genesis.json* file, which is used to set predefined chain state before starting the client. The structure of the genesis file is described below |


## 👷 Operator Commands

| **Command**            | **Description**                                                                     |
|------------------------|-------------------------------------------------------------------------------------|
| peers add <*address*\>    | Adds a new peer. The parameter is a libp2p address                                  |
| peers list             | Lists all the peers the client is connected to, through libp2p                      |
| peers status <*address*\> | Returns the status of a specific peer from the peers list, using the libp2p address |
| status                 | Returns the status of the client. The detailed response can be found below          |
| monitor                | Subscribes to a blockchain event stream. The detailed response can be found below   |
| version                | Returns the current version of the client  

All the CLI commands are implemented in:
````bash
minimal/system_service.go
````

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

### Genesis Template
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

## Command Flags

| **Command**       | **Description**                                                                                                     |
|-------------------|---------------------------------------------------------------------------------------------------------------------|
| seal              | Makes the current node join the sealing process                                                                     |
| data-dir <*path*\>  | Specify the directory for storing Polygon SDK client data. The structure of the generated folder is described below |
| config <*path*\>    | Pass in a configuration file for the command flags                                                                  |
| grpc <*address*\>   | Specify the address (and port!) for the GRPC server                                                                 |
| libp2p <*address*\> | Specify the address (and port!) for the libp2p server                                                               |
| jsonrpc           | Specify the address (and port!) for the JSON RPC server                                                             |
| join <*address*\>   | Adds another node as a peer using the libp2p address of the node                                                    |

The **shorthand** when specifying addresses and ports is **:<port\>**, which sets the address part to localhost (127.0.0.1).

## 📜 Resources
* **[Protocol Buffers](https://developers.google.com/protocol-buffers)**