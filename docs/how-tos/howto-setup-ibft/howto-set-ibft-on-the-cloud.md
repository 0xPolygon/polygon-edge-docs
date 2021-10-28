---
id: howto-set-ibft-on-the-cloud
title: How to set up IBFT on the cloud
---

:::info This guide is for mainnet or testnet setups

The below guide will instruct you how to set up an IBFT network on a cloud provider for a production setup of your testnet or mainnet.

If you would like to setup the IBFT cluster locally to quickly test the `polygon-sdk` before doing a production like setup, please refer to
[How to set IBFT locally](/docs/how-tos/howto-setup-ibft/howto-set-ibft-locally)
:::

## Requirements

### Use the develop branch

The main Polygon SDK version is located on the [develop branch](https://github.com/0xPolygon/polygon-sdk/tree/develop), and is considered to be a stable version of the SDK,
while other branches are mid-feature implementations.

As the develop branch is the default one, simply running:

```
git clone https://github.com/0xPolygon/polygon-sdk.git
```

will fetch the latest stable source code.

Please make sure to have the latest stable source code of the polygon-sdk on all VMs that you will use for building the IBFT cluster.

### Go version

The required version of the Go programming language is `>=1.16`. 

### Setting up the VM connectivity

Depending on your choice of the cloud provider, you may set up connectivity and rules between the VMs using a firewall,
security groups, or access control lists.

As the only part of the `polygon-sdk` that needs to be exposed to other VMs is the libp2p server, simply allowing
all communication between VMs on the default libp2p port `1478` is enough.

## Overview

![Cloud setup](/img/ibft-setup/cloud.svg)

In this guide our goal is to establish a working `polygon-sdk` blockchain network working with [IBFT consensus protocol](https://github.com/ethereum/EIPs/issues/650).
The blockchain network will consist of 4 nodes of whom all 4 are validator nodes, and as such are eligible for both proposing block, and validating blocks that came from other proposers.
Each of the 4 nodes will run on their own VM, as the idea of this guide is to give you a fully functional IBFT cluster while keeping the validator keys private to ensure a trustless network setup.

In order to achieve that, we will guide you through 4 easy steps:

0. Take a look at the list of **Requirements** above
1. Generate the private keys for each of the validators, and initialize the data directory
2. Prepare the connection string for the bootnode to be put into the shared `genesis.json`
3. Create the `genesis.json` on your local machine, and send/transfer it to each of the nodes
4. Start all the nodes 

## Step 1: Initialize data folders for IBFT and generate validator keys

In order to get up and running with IBFT, you need to initialize the data folders, on each node:


````bash
node-1> go run main.go ibft init --data-dir data-dir
````

````bash
node-2> go run main.go ibft init --data-dir data-dir
````

````bash
node-3> go run main.go ibft init --data-dir data-dir
````

````bash
node-4> go run main.go ibft init --data-dir data-dir
````

Each of these commands will print the [node ID](https://docs.libp2p.io/concepts/peer-id/). You will need that information for the next step.

:::warning Keep your data directory to yourself!

The data directories generated above, besides from initializing the directories for holding the blockchain state, will also generate your validator's private keys.
**This key should be kept as a secret, as stealing it would render somebody capable of impersonating you as the validator in the network!**
:::

## Step 2: Prepare the multiaddr connection string for the bootnode

For a node to successfully establish connectivity, it must know which `bootnode` server to connect to in order gain
information about all the remaining nodes on the network. The `bootnode` is sometimes also known as the `rendezvous` server in p2p jargon.

`bootnode` is not a special instance of the polygon-sdk node. Every polygon-sdk node can serve as a `bootnode`, but
every polygon-sdk node needs to have a set of bootnodes specified which will be contacted to provide information on how to connect with
all remaining nodes in the network.

In order to create the connection string for specifying the bootnode, we will need to conform
to the [multiaddr format](https://docs.libp2p.io/concepts/addressing/):
```
/ip4/<ip_address>/tcp/<port>/p2p/<node_id>
```

In this guide, we will treat the first node as the bootnode for all other nodes. What will happen in this scenario
is that `nodes 2-4` connecting to the `node 1` will get information on how to connect to one another through the mutually
contacted `node 1`. 

:::info You need to specify at least one bootnode for discovery to work

Having more bootnodes specified when setting up the network will give your nodes more resilience if one of the bootnodes becomes unresponsive, as there will be others to fallback to. It is up to you to decide if you want to list all 4 nodes as the bootnodes, or just one. In this guide we will list only one, but this can be changed on the fly, with no impact on the validity of the `genesis.json` file.
:::

As the first part of the multiaddr connection string is the `<ip_address>`, here you will need to enter the IP address as reachable by other nodes, depending on your setup this might be a private or a public IP address, not `127.0.0.1`.

For the `<port>` we will use `1478`, since it is the default libp2p port.

And lastly, we need the `<node_id>` which we can get from the output of the previously ran command `go run main.go ibft init --data-dir data-dir` command (which was used to generate keys and data directories for the `node 1`)

After the assembly, the multiaddr connection string to the `node 1` which we will use as the bootnode will look something like this (only the `<node_id>` which is at the end should be different):
```
/ip4/<public_or_private_ip>/tcp/1478/p2p/16Uiu2HAmJxxH1tScDX2rLGSU9exnuvZKNM9SoK3v315azp68DLPW
```

## Step 3: Generate an IBFT genesis file with the 4 nodes as validators

This step can be run on your local machine, but you will need the public validator keys for each of the 4 validators.

Validators can safely share the `Public key (address)` as displayed below in the output to their `ibft init` commands, so that
you may securely generate the genesis.json with those validators in the initial validator set, identified by their public keys:

```
[IBFT INIT]
Public key (address) = 0xC12bB5d97A35c6919aC77C709d55F6aa60436900
Node ID              = 16Uiu2HAmVZnsqvTwuzC9Jd4iycpdnHdyVZJZTpVC8QuRSKmZdUrf
```

Given that you have received all 4 of the validators' public keys, you can run the following command to generate the `genesis.json`

````bash
go run main.go genesis --consensus ibft --ibft-validator=0xC12bB5d97A35c6919aC77C709d55F6aa60436900 --ibft-validator=<2nd_validator_pubkey> --ibft-validator=<3rd_validator_pubkey> --ibft-validator=<4th_validator_pubkey> --bootnode=<bootnode_multiaddr_connection_string_from_step_2> --bootnode <optionally_more_bootnodes>
````

What this command does:

* The `--ibft-validator` sets the public key of the validator that should be included in the initial validator set in the genesis block. There can be many initial validators.
* The `--bootnode` sets the address of the bootnode that will enable the nodes to find each other.
  We will use the multiaddr string of the `node 1`, as mentioned in **step 2**, although you can add as many bootnodes as you want, as displayed above.

:::info Premining account balances

You will probably want to set up your blockchain network with some addresses having "premined" balances.

To achieve this, pass as many `--premine` flags as you want per address that you want to be initialized with a certain balance
on the blockchain.

Example if we would like to premine 1000 ETH to address `0x3956E90e632AEbBF34DEB49b71c28A83Bc029862` in our genesis block, then we would need to supply the following argument:

```
--premine=0x3956E90e632AEbBF34DEB49b71c28A83Bc029862:1000000000000000000000
```

**Note that the premined amount is in WEI, not ETH.**

:::

:::info Set the block gas limit

The default gas limit for each block is `5242880`. This value is written in the genesis file, but you may want to
increase / decrease it.

```go title="command/helper/helper.go"
const (
	GenesisFileName       = "./genesis.json"
	DefaultChainName      = "example"
	DefaultChainID        = 100
	DefaultPremineBalance = "0x3635C9ADC5DEA00000"
	DefaultConsensus      = "pow"
	GenesisGasUsed        = 458752
	GenesisGasLimit       = 5242880 // The default block gas limit
)
```

To do so, you can use the flag `--block-gas-limit` followed by the desired value as shown below :

```shell
--block-gas-limit 1000000000
```

:::

After specifying the:
1. Public keys of the validators to be included in the genesis block as the validator set
2. Bootnode multiaddr connection strings
3. Premined accounts and balances to be included in the genesis block

and generating the `genesis.json`, you should copy it over to all of the VMs in the network. Depending on your setup you may
copy/paste it, send it to the node operator, or simply SCP/FTP it over.

The structure of the genesis file is covered in the [CLI Commands](/docs/cli-commands) section.

## Step 4: Run all the clients

:::note Networking on Cloud providers

Most cloud providers don't expose the IP addresses (especially public ones) as a direct network interface on your VM but rather setup an invisible NAT proxy.


To allow the nodes to connect to each other in this case you would need to listen on the `0.0.0.0` IP address to bind on all interfaces, but you would still need to specify the IP address which other nodes can use to connect to your instance. This is achieved using the `--nat` argument where you can specify your external IP.

#### Example

The associated IP address that you wish to listen on is `192.0.2.1`, but it is not directly bound to any of your network interfaces.

To allow the nodes to connect you would pass the following parameters:

`go run main.go ... --libp2p 0.0.0.0:10001 --nat 192.0.2.1`

This would make your node listen on all interfaces, but also make it aware that the clients are connecting to it through the specified `--nat` address.

:::

To run the **first** client:


````bash
node-1> go run main.go server --data-dir ./data-dir --chain genesis.json  --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

To run the **second** client:

````bash
node-2> go run main.go server --data-dir ./data-dir --chain genesis.json --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

To run the **third** client:

````bash
node-3> go run main.go server --data-dir ./data-dir --chain genesis.json --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

To run the **fourth** client:

````bash
node-4> go run main.go server --data-dir ./data-dir --chain genesis.json --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

After running the previous commands, you have set up a trustless 4 client IBFT network, capable of sealing blocks and recovering
from node failure.