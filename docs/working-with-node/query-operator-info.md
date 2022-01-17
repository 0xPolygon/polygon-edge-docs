---
id: query-operator-info
title: Query operator information
---

## Prerequisites

This guide assumes you have followed the [Local Setup](/docs/get-started/set-up-ibft-locally) or [guide on how to set up an IBFT cluster on the cloud](/docs/get-started/set-up-ibft-on-the-cloud).

A functioning node is required in order to query any kind of operator information.

With the Polygon Edge, node operators are in control and informed about what the node they're operating is doing.<br />
At any time, they can use the node information layer, built on top of gRPC, and get meaningful information - no log sifting required.

:::note

If your node isn't running on `127.0.0.1:8545` you should add a flag `--grpc-address <address:port>` to the commands listed in this document.

:::

## Peer information

### Peers list

To get a complete list of connected peers (including the running node itself), run the following command:
````bash
polygon-edge peers list
````

This will return a list of libp2p addresses that are currently peers of the running client.

### Peer status

For the status of a specific peer, run:
````bash
polygon-edge peers status --peer-id <address>
````
With the *address* parameter being the libp2p address of the peer.

## IBFT info

Lots of times, an operator might want to know about the state of the operating node in IBFT consensus.

Luckily, the Polygon Edge provides an easy way to find this information.

### Snapshots

Running the following command returns the most recent snapshot.
````bash
polygon-edge ibft snapshot
````
To query the snapshot at a specific height (block number), the operator can run:
````bash
polygon-edge ibft snapshot --num <block-number>
````

### Candidates

To get the latest info on candidates, the operator can run:
````bash
polygon-edge ibft candidates
````
This command queries the current set of proposed candidates, as well as candidates that have not been included yet

### Status

The following command returns the current validator key of the running IBFT client:
````bash
polygon-edge ibft status
````

## Transaction pool

To find the current number of transactions in the transaction pool, the operator can run:
````bash
polygon-edge txpool status
````
