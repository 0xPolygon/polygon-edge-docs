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

The how-to guides assume you have a working installation of Golang running on your machine, with Go added to the $PATH variable.


This example will go over the basics of starting multiple nodes, and demonstrate how the nodes interact between each other.

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

## Step 2: Generate an IBFT genesis file with the previous accounts as validators
````bash
go run main.go genesis --consensus ibft --ibft-validators-prefix-path test-chain-
````

What this command does:
* The *consensus* flag sets the consensus to IBFT
* The *--ibft-validators-prefix-path* sets the prefix folder path to the one specified which IBFT in Polygon SDK can use.
This directory is used to house the **consensus** folder, where the validator's private key is kept. The validator's PK
  is needed in order to build the genesis file

## Step 3: Run all the clients

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

To briefly go over what has been done so far:

* The directory for the client data has been specified to be **./test-chain-\***
* The GRPC server has been started on ports **10000**, **20000** and **30000**, respectively
* The libp2p server has been started on ports **10001**, **20001** and **30001**, respectively
* The JSON-RPC server has been started on ports **10002**, **20002** and **30002**, respectively
* The *seal* flag means that the node being started is going to participate in block sealing
* The *chain* flag specifies which genesis file should be used for chain configuration

The structure of the genesis file is covered in the [CLI Commands](/docs/cli-commands) section.

After running the previous commands, you have set up a 3 client IBFT network, capable of sealing blocks
and recovering from node failure.

## Step 3: Monitor node activity

Now that you've set up at least 1 running client, you can monitor the information that passes through, 
such as forks and reorgs, using the **monitor** command:

````bash
go run main.go monitor --address localhost:20000
````

The above command will start monitoring blockchain event activity on the client that's running on port *20000*