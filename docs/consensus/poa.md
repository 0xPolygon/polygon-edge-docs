---
id: poa
title: Proof of Authority (PoA)
---

## Overview

The IBFT PoA is the default consensus mechanism in the Polygon Edge. In PoA, validators are the ones responsible for creating the blocks and adding them to the blockchain in a series.

All of the validators make up a dynamic validator-set, where validators can be added to or removed from the set by employing a voting mechanism. This means that validators can be voted in/out from the validators-set if the majority (51%) of the validator nodes vote to add/drop a certain validator to/from the set. In this way, malicious validators can be recognized and removed from the network, while new trusted validators can be added to the network.

All of the validators take turns in proposing the next block (round-robin), and for the block to be validated/inserted in the blockchain, a supermajority (more than 2/3) of the validators must approve the said block.

Besides validators, there are non-validators who do not participate in the block creation but do participate in the block validation process.

## Adding a validator to the validator-set

This guide describes how to add a new validator node to an active IBFT network with 4 validator nodes.
If you need help setting up the the network refer to the [Local Setup](/docs/get-started/set-up-ibft-locally) / [Cloud Setup](/docs/get-started/set-up-ibft-on-the-cloud) sections.

### Step 1: Initialize data folders for IBFT and generate validator keys​ for the new node

In order to get up and running with IBFT on the new node, you first need to initialize the data folders and generate the keys:

````bash
polygon-edge secrets init --data-dir test-chain-5
````

This command will print the validator key (address) and the node ID. You will need the validator key (address) for the next step.

### Step 2: Propose a new candidate from other validator nodes

For a new node to become a validator at least 51% of validators need to propose him.

Example of how to propose a new validator (`0x8B15464F8233F718c8605B16eBADA6fc09181fC2`) from the existing validator node on grpc address: 127.0.0.1:10000:

````bash
polygon-edge ibft propose --grpc-address 127.0.0.1:10000 --addr 0x8B15464F8233F718c8605B16eBADA6fc09181fC2 --vote auth
````

The structure of the IBFT commands is covered in the [CLI Commands](/docs/get-started/cli-commands) section.

### Step 3: Run the client node

Because in this example we are attempting to run the network where all nodes are on the same machine, we need to take care to avoid port conflicts. 

````bash
polygon-edge server --data-dir ./test-chain-5 --chain genesis.json --grpc-address :50000 --libp2p :50001 --jsonrpc :50002 --seal
````

After fetching all blocks, inside your console you will notice that a new node is participating in the validation

````bash
2021-12-01T14:56:48.369+0100 [INFO]  polygon.consensus.ibft.acceptState: Accept state: sequence=4004
2021-12-01T14:56:48.369+0100 [INFO]  polygon.consensus.ibft: current snapshot: validators=5 votes=0
2021-12-01T14:56:48.369+0100 [INFO]  polygon.consensus.ibft: proposer calculated: proposer=0x8B15464F8233F718c8605B16eBADA6fc09181fC2 block=4004
````

:::info Promoting a non-validator to a validator 
Naturally, a non-validator can become a validator by the voting process, but for it to be successfully included in the validator-set after the voting process, the node has to be restarted with the `--seal` flag.
:::

## Removing a validator from the validator-set

This operation is fairly simple. To remove a validator node from the validator-set, this command needs to be performed for the majority of the validator nodes.

````bash
polygon-edge ibft propose --grpc-address 127.0.0.1:10000 --addr 0x8B15464F8233F718c8605B16eBADA6fc09181fC2 --vote drop
````

After the commands are performed, observe that the number of validators has dropped (in this log example from 4 to 3).

````bash
2021-12-15T19:20:51.014+0100 [INFO]  polygon.consensus.ibft.acceptState: Accept state: sequence=2399 round=1
2021-12-15T19:20:51.014+0100 [INFO]  polygon.consensus.ibft: current snapshot: validators=4 votes=2
2021-12-15T19:20:51.015+0100 [INFO]  polygon.consensus.ibft.acceptState: we are the proposer: block=2399
2021-12-15T19:20:51.015+0100 [INFO]  polygon.consensus.ibft: picked out txns from pool: num=0 remaining=0
2021-12-15T19:20:51.015+0100 [INFO]  polygon.consensus.ibft: build block: number=2399 txns=0
2021-12-15T19:20:53.002+0100 [INFO]  polygon.consensus.ibft: state change: new=ValidateState
2021-12-15T19:20:53.009+0100 [INFO]  polygon.consensus.ibft: state change: new=CommitState
2021-12-15T19:20:53.009+0100 [INFO]  polygon.blockchain: write block: num=2399 parent=0x768b3bdf26cdc770525e0be549b1fddb3e389429e2d302cb52af1722f85f798c
2021-12-15T19:20:53.011+0100 [INFO]  polygon.blockchain: new block: number=2399 hash=0x6538286881d32dc7722dd9f64b71ec85693ee9576e8a2613987c4d0ab9d83590 txns=0 generation_time_in_sec=2
2021-12-15T19:20:53.011+0100 [INFO]  polygon.blockchain: new head: hash=0x6538286881d32dc7722dd9f64b71ec85693ee9576e8a2613987c4d0ab9d83590 number=2399
2021-12-15T19:20:53.011+0100 [INFO]  polygon.consensus.ibft: block committed: sequence=2399 hash=0x6538286881d32dc7722dd9f64b71ec85693ee9576e8a2613987c4d0ab9d83590 validators=4 rounds=1 committed=3
2021-12-15T19:20:53.012+0100 [INFO]  polygon.consensus.ibft: state change: new=AcceptState
2021-12-15T19:20:53.012+0100 [INFO]  polygon.consensus.ibft.acceptState: Accept state: sequence=2400 round=1
2021-12-15T19:20:53.012+0100 [INFO]  polygon.consensus.ibft: current snapshot: validators=3 votes=0
2021-12-15T19:20:53.012+0100 [INFO]  polygon.consensus.ibft: proposer calculated: proposer=0xea21efC826F4f3Cb5cFc0f986A4d69C095c2838b block=2400
````