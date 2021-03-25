---
id: polygon-sdk-architecture 
title: Architecture 
sidebar_label: Architecture
---

We started with the idea of making software that is *modular*.

This is something that is present in almost all parts of the Polygon SDK. Below, you will find a brief overview of the
built architecture and its layering.

## Polygon SDK Layering

![Polygon SDK Architecture](/img/Architecture.jpg)

## Libp2p

It all starts at the base networking layer, which utilizes **libp2p**. We decided to go with this technology because it
fits into the designing philosophies of Polygon SDK. Libp2p is:

- Modular
- Extensible
- Fast
  
Most importantly, it provides a great foundation for more advanced features, which we'll cover later on.


## Synchronization & Consensus
The separation of the synchronization and consensus protocols allows for modularity and implementation of **custom** sync and consensus mechanisms - depending on how the client is being run.

Polygon SDK is designed to offer off-the-shelf pluggable consensus algortihms.

The current list of supported consensus algorithms:

* IBFT
* Ethereum's Nakamoto PoW
* Clique PoA (not fully implemented yet)

We plan to add support for more consensus algorithms in the future (HotSuff, Tendermint etc). Contact us if you would like to use a specific, not yet supported algorithm for your project.

## Blockchain
The Blockchain layer is the central layer that coordinates everything in the Polygon SDK system. It is covered in depth in the corresponding *Modules* section.

## State
The State layer contains state transition logic. It deals with how the state changes when a new block is included. It is covered in depth in the corresponding *Modules* section.

## JSON RPC
The JSON RPC layer is an API layer that dApp developers use to interact with the blockchain. It is covered in depth in the corresponding *Modules* section.