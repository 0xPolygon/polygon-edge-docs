---
id: overview 
title: Polygon Edge
sidebar_label: Overview
---

Polygon Edge is a modular and extensible framework for building Ethereum-compatible blockchain networks, sidechains, and general scaling solutions.

Its primary use is to bootstrap a new blockchain network while providing full compatibility with Ethereum smart contracts and transactions. It uses IBFT (Istanbul Byzantine Fault Tolerant) consensus mechanism, supported in two flavours as [PoA (proof of authority)](/docs/consensus/poa) and [PoS (proof of stake)](/docs/consensus/pos-stake-unstake).

Polygon Edge also supports communication with multiple blockchain networks, enabling transfers of both [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20) and [ERC-721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721) tokens, by utilising the [centralised bridge solution](/docs/additional-features/chainbridge/overview).

Industry standard wallets can be used to interact with Polygon Edge through the [JSON-RPC](/docs/working-with-node/query-json-rpc) endpoints and node opeartors can perform various actions on the nodes through the [gRPC](/docs/working-with-node/query-operator-info) protocol.

This is the first implementation of Polygon Edge, written in **Golang**. Other implementations, written in other
programming languages might be introduced in the future. If you would like to contribute to this or any future
implementation, please reach out to the [Polygon team](mailto:contact@polygon.technology).

To find out more about Polygon, visit the [official website](https://polygon.technology).

**[Github repository](https://github.com/0xPolygon/polygon-sdk)**

:::caution

This is a work in progress so architectural changes may happen in the future. The code has not been audited
yet, so please contact the Polygon team if you would like to use it in production.

:::



To get started by running the IBFT `polygon-sdk` cluster locally, please read: [How to set IBFT locally](/docs/get-started/set-up-ibft-locally).
