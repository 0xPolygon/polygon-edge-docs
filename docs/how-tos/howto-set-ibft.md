---
id: howto-set-ibft 
title: How to set up IBFT
---

## Useful information

For a better understanding of some commands that will be used later on, it is recommended that you go over
the [CLI Commands](/docs/cli-commands), before diving deeper into the examples below.

The main Polygon SDK version is located on the **develop** branch, and is considered to be a stable version of the SDK,
while other branches are mid-feature implementations.

The technologies mentioned in the examples are covered in their corresponding modules in the documentation.

The how-to guides assume you have a working installation of Golang running on your machine, with Go added to the $PATH
variable.

This example will go over the basics of starting multiple nodes, and demonstrate how the nodes interact between each
other.

## Step 1: Initialize data folders for IBFT

In order to get up and running with IBFT, you need to initialize some data folders:

````bash
go run main.go ibft init --data-dir test-chain-1
````

````bash
go run main.go ibft init --data-dir test-chain-2
````

````bash
go run main.go ibft init --data-dir test-chain-3
````

````bash
go run main.go ibft init --data-dir test-chain-4
````

Each of these commands will print [node ID](https://docs.libp2p.io/concepts/peer-id/). You will need that information for the next step.

## Step 2: Using the clients as bootstrap nodes

To start the clients as bootstrap nodes you will need to specify their address schemes by encoding them
into a [multiaddr format](https://docs.libp2p.io/concepts/addressing/):
```
/ip4/<ip_address>/tcp/<port>/p2p/<node_id>
```

To do so, you should specify the IP address and the port for each of the clients,
and append the node ID (from the previous step) to it. For example:

```
/ip4/127.0.0.1/tcp/10001/p2p/16Uiu2HAmJxxH1tScDX2rLGSU9exnuvZKNM9SoK3v315azp68DLPW
```

## Step 3: Generate an IBFT genesis file with the previous accounts as validators

````bash
go run main.go genesis --consensus ibft --ibft-validators-prefix-path test-chain- --bootnode /ip4/127.0.0.1/tcp/10001/p2p/<node_id_1> --bootnode /ip4/127.0.0.1/tcp/20001/p2p/<node_id_2> --bootnode /ip4/127.0.0.1/tcp/30001/p2p/<node_id_3> --bootnode /ip4/127.0.0.1/tcp/40001/p2p/<node_id_4>
````

What this command does:

* The *consensus* flag sets the consensus to IBFT
* The *--ibft-validators-prefix-path* sets the prefix folder path to the one specified which IBFT in Polygon SDK can
  use. This directory is used to house the **consensus** folder, where the validator's private key is kept. The
  validator's PK is needed in order to build the genesis file - the initial list of bootstrap nodes.
* The *--bootnode* sets the bootnodes addresses that will be used to allow a new node to discover other nodes in the network through them.
  Since we are starting a new network, and it only consists of these nodes, we enter their `multiaddr` addresses.

## Step 4: Run all the clients

To run the **first** client:

````bash
go run main.go server --data-dir ./test-chain-1 --chain genesis.json --grpc :10000 --libp2p :10001 --jsonrpc :10002 --seal
````

To run the **second** client:

````bash
go run main.go server --data-dir ./test-chain-2 --chain genesis.json --grpc :20000 --libp2p :20001 --jsonrpc :20002 --seal
````

To run the **third** client:

````bash
go run main.go server --data-dir ./test-chain-3 --chain genesis.json --grpc :30000 --libp2p :30001 --jsonrpc :30002 --seal
````

To run the **fourth** client:

````bash
go run main.go server --data-dir ./test-chain-4 --chain genesis.json --grpc :40000 --libp2p :40001 --jsonrpc :40002 --seal
````

To briefly go over what has been done so far:

* The directory for the client data has been specified to be **./test-chain-\***
* The GRPC server has been started on ports **10000**, **20000**, **30000** and **40000**, respectively
* The libp2p server has been started on ports **10001**, **20001**, **30001** and **40001**, respectively
* The JSON-RPC server has been started on ports **10002**, **20002**, **30002** and **40002**, respectively
* The *seal* flag means that the node being started is going to participate in block sealing
* The *chain* flag specifies which genesis file should be used for chain configuration

The structure of the genesis file is covered in the [CLI Commands](/docs/cli-commands) section.

After running the previous commands, you have set up a 4 client IBFT network, capable of sealing blocks and recovering
from node failure.

## Step 5: Monitor node activity

Now that you've set up at least 1 running client, you can monitor the information that passes through, such as forks and
reorgs, using the **monitor** command:

````bash
go run main.go monitor --grpc-address localhost:20000
````

The above command will start monitoring blockchain event activity on the client that's running on port *20000*

## Networking on Cloud providers

:::note

Most cloud providers don't expose the IP addresses (especially public ones) as a direct network interface on your VM but rather setup an invisible NAT proxy.

:::

To allow the nodes to connect to each other in this case you would need to listen on the `0.0.0.0` IP address to bind on all interfaces, but you would still need to specify the IP address which other nodes can use to connect to your instance. This is achieved using the `--nat` argument where you can specify your external IP.

### Example

The associated IP address that you wish to listen on is `192.0.2.1`, but it is not directly bound to any of your network interfaces.

To allow the nodes to connect you would pass the following parameters:

`go run main.go ... --libp2p 0.0.0.0:10001 --nat 192.0.2.1`

This would make your node listen on all interfaces, but also make it aware that the clients are connecting to it through the specified `--nat` address.
