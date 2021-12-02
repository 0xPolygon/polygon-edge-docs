---
id: howto-add-new-validators
title: How to add new validators to an active network
---
## Requirements

### Setup IBFT

To setup the network with 4 active validator nodes locally, refer to the [setup IBFT locally](/docs//how-tos/howto-setup-ibft/howto-set-ibft-locally) section.

## Overview
This guide goes into detail on how to add a new validator node to an active IBFT network with 4 validator nodes.

## Step 1: Initialize data folders for IBFT and generate validator keys​ for the new node

In order to get up and running with IBFT on the new node, you first need to initialize the data folders and generate the keys:

````bash
go run main.go secrets init --data-dir test-chain-5
````

This command will print the validator key (address) and the node ID. You will need the validator key (address) for the next step.

## Step 2: From other validator nodes proposes a new candidate to be added

For a new node to become a validator at least 51% of validators need to propose him.

Example of how to propose a new validator (`0x8B15464F8233F718c8605B16eBADA6fc09181fC2`) from the existing validator node on grpc address: 127.0.0.1:10000:

````bash
go run main.go ibft propose --grpc-address 127.0.0.1:10000 --addr 0x8B15464F8233F718c8605B16eBADA6fc09181fC2 --vote auth
````

The structure of the IBFT commands is covered in the [CLI Commands](/docs/cli-commands) section.

## Step 3: Run the client node

Because in this example we are attempting to run the IBFT network where all nodes are on the same machine, we need to take care to avoid port conflicts. 

````bash
go run main.go server --data-dir ./test-chain-5 --chain genesis.json --grpc :50000 --libp2p :50001 --jsonrpc :50002 --seal
````

After fetching all blocks, inside your console you will notice that a new node is participating in the validation

````bash
2021-12-01T14:56:48.369+0100 [INFO]  polygon.consensus.ibft.acceptState: Accept state: sequence=4004
2021-12-01T14:56:48.369+0100 [INFO]  polygon.consensus.ibft: current snapshot: validators=5 votes=0
2021-12-01T14:56:48.369+0100 [INFO]  polygon.consensus.ibft: proposer calculated: proposer=0x8B15464F8233F718c8605B16eBADA6fc09181fC2 block=4004
````






