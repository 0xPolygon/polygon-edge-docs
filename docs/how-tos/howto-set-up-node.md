---
id: howto-set-up-node
title: How to set up a node locally
---

## Useful information

For a better understanding of some commands that will be used later on, it is recommended that you go over
the [CLI Commands](/docs/cli-commands), before diving deeper into the examples below.

The main Polygon SDK version is located on the **develop** branch, and is considered to be a stable version of the SDK,
while other branches are mid-feature implementations.

The technologies mentioned in the examples are covered in their corresponding modules in the documentation.

The how-to guides assume you have a working installation of Golang running on your machine, with Go added to the $PATH variable.


This example will go over the basics of starting a node, and demonstrate how the nodes interact between each other.

## Step 1: Start 1 node

The following command will start 1 node:

````bash
go run main.go server --data-dir ./test-chain-1 --grpc :10000 --libp2p :10001 --jsonrpc :10002 --seal
````

To briefly go over what has been done so far:

* The directory for the client data has been specified to be ./test-chain-1
* The GRPC server has been started on port **10000**
* The libp2p server has been started on port **10001**
* The JSON-RPC server has been started on port **10002**
* The *seal* flag means that the node being started is going to participate in block sealing

By default, the client uses an empty genesis file with a ~5s PoW. The structure of the genesis file is covered in
the [CLI Commands](/docs/cli-commands) section.

After running the previous command, in the logs of the running client you will see the **libP2P** address required to
connect to this node. This should be an address in the following form:

````bash
/ip4/7.7.7.7/tcp/4242/p2p/QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N
````

## Step 2: Start the 2nd node

The next step would be to start a second node, also locally, and connect it to the first:

````bash
go run main.go server --data-dir ./test-chain-2 --grpc :20000 --libp2p :20001 --jsonrpc :20002 --seal --join <node-1-libp2p-addr>
````

The meaning of the commands are the same as in the previous execution, the only thing that is notable is the **join**
flag, which specifies the previously started node as a peer.

## Step 3: Monitor events

To monitor blockchain events(i.e forks, reorgs...) from node 2, the following command is used:
````bash
go run main.go monitor --address localhost:20000
````