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

It all starts at the base networking layer, which utilizes **libp2p**. We decided to go with this technology becuse it
fits into the designing philosophies of Polygon SDK. Libp2p is:

- Modular
- Extensible
- Fast
  
Most importantly, it provides a great foundation for more advanced features, which we'll cover later on.


## Synchronization
This is the synchronization block

## Consensus
This is the consensus block

## Blockchain
This is the blockchain block

## State
This is the state blcok

## JSON RPC
This is the JSON RPC block