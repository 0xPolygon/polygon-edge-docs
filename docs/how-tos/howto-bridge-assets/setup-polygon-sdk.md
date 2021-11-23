---
id: setup-polygon-sdk
title: Polygon SDK Setup
---

In this section, you will setup Polygon SDK network locally.

First, you will get the codes from the repository, build the codes, and move the binary under /usr/local/bin so that you can run it as a command.

```bash
$ git clone https://github.com/0xPolygon/polygon-sdk.git
$ cd polygon-sdk
$ go build -o main main.go && mv ./main /usr/local/bin/polygon-sdk
```

## Step 1: Generate validator keys

Next, we'll generate validator keys and genesis.json. In IBFT that is a consensus Polygon SDK has, there are 4 validators to run at least. `ibft init` command creates new keys and prepare for the data directory node will store data into. `ibft init` commands will output validator address and Libp2p ID.

```bash
# Setup keys and prepare for data directory for validators
$ polygon-sdk ibft init --data-dir test-chain-1

[IBFT INIT]
Public key (address) = <Node 1 Validator Address>
Node ID              = <Node 1 Libp2p ID>

$ polygon-sdk ibft init --data-dir test-chain-2

[IBFT INIT]
Public key (address) = <Node 2 Validator Address>
Node ID              = <Node 2 Libp2p ID>

$ polygon-sdk ibft init --data-dir test-chain-3

[IBFT INIT]
Public key (address) = <Node 3 Validator Address>
Node ID              = <Node 3 Libp2p Node ID>

$ polygon-sdk ibft init --data-dir test-chain-4

[IBFT INIT]
Public key (address) = <Node 4 Validator Address>
Node ID              = <Node 4 Libp2p Node ID>
```

## Step 2: Generate genesis.json

Then, you will generate genesis.json by `genesis` command. An account can have native tokens by specifying premine account on `genesis` command. Native tokens will be paid to deploy contracts by `admin`, vote/execute for proposal by `relayer`, and call `deposit` by `user`. Set each validator libp2p addresses as bootnodes by `bootnode` flag so that validators can connect to each other automatically. Please check [this section](https://sdk-docs.polygon.technology/docs/how-tos/howto-setup-ibft/howto-set-ibft-locally#step-2-prepare-the-multiaddr-connection-string-for-the-bootnode) for more details.

```bash
# Generate genesis.json
$ polygon-sdk genesis \
  --consensus ibft \
  --chainid 100 \
  --name polygon-sdk \
  --ibft-validators-prefix-path test-chain- \
  # Give native tokens on genesis to the following address
  --premine [ADMIN_ACCOUNT_ADDRESS] \
  --premine [RELAYER_ACCOUNT_ADDRESS] \
  --premine [USER_ACCOUNT_ADDRESS] \
  # Set initial nodes as bootnodes
  --bootnode /ip4/127.0.0.1/tcp/10001/p2p/[Node 1 Libp2p ID] \
  --bootnode /ip4/127.0.0.1/tcp/20001/p2p/[Node 2 Libp2p ID] \
  --bootnode /ip4/127.0.0.1/tcp/30001/p2p/[Node 3 Libp2p ID] \
  --bootnode /ip4/127.0.0.1/tcp/40001/p2p/[Node 4 Libp2p ID] \
  # Set genesis block gas limit
  --block-gas-limit 10000000

[GENESIS SUCCESS]
Genesis written to genesis.json
```

## Step 3: Start Polygon SDK nodes

And finally, you will start Polygon SDK nodes. You need to specify the data directory and genesis.json. In addition, give the ports for gRPC, libp2p, and JSON-RPC in order to avoid port collision.

```bash
# Start first node
$ polygon-sdk server --data-dir ./test-chain-1 --grpc :10000 --libp2p :10001 --jsonrpc :10002 --seal --chain ./genesis.json
# Start second node
$ polygon-sdk server --data-dir ./test-chain-2 --grpc :20000 --libp2p :20001 --jsonrpc :20002 --seal --chain ./genesis.json
# Start third node
$ polygon-sdk server --data-dir ./test-chain-3 --grpc :30000 --libp2p :30001 --jsonrpc :30002 --seal --chain ./genesis.json
# Start fourth node
$ polygon-sdk server --data-dir ./test-chain-4 --grpc :40000 --libp2p :40001 --jsonrpc :40002 --seal --chain ./genesis.json
```

After you start all nodes, you can query or send transactions by JSON-RPC with one of the following URLs:

| **Node** | **JSON-RPC URL**       |
|----------|------------------------|
| Node 1   | http://localhost:10002 |
| Node 2   | http://localhost:20002 |
| Node 3   | http://localhost:30002 |
| Node 4   | http://localhost:40002 |

To find out more about Polygon SDK setup, visit the [How to set up IBFT locally](https://sdk-docs.polygon.technology/docs/how-tos/howto-setup-ibft/howto-set-ibft-locally).
