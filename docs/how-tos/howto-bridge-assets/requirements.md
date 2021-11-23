---
id: requirements
title: Requirements
---

This guide walks through the setup for a bridge between a running Polygon PoS (Mumbai testnet) and a local Polygon SDK network.

## Requirements

In this guide, you will run PolygonSDK nodes, ChainBridge relayer, and cb-sol-cli tool which is a CLI tool to deploy contracts locally. The following environments are required before starting setup.

* Go: >= 1.16
* Node.js >= 16.13.0
* Git

In addition, you need to clone the following repositories with the versions to run some applications.

* [Polygon SDK](https://github.com/0xPolygon/polygon-sdk.git): on the `develop` branch
* [ChainBridge](https://github.com/ChainSafe/ChainBridge): v1.1.5
* [ChainBridge Deploy Tools](https://github.com/ChainSafe/chainbridge-deploy): `f2aa093` on `main` branch

You need to setup Polygon SDK network before you proceed the next section. Please check [How to set up IBFT locally](/docs/how-tos/howto-setup-ibft/howto-set-ibft-locally) for the details. 

## Accounts

In this guide, you will use three types of Ethereum accounts in both chain. Please make sure the accounts have enough native tokens to create transactions before staring. An account can act in several roles at the same time.

| **Type** |**Description**                                                                                                                |
|----------|-------------------------------------------------------------------------------------------------------------------------------|
| admin    | The account that deploys Bridge contract. This account will be given `admin` role as default and be able to do certain actions in Bridge. The admin account pay gas cost when deploying contracts, registering resource ID, update settings in contracts, minting tokens. |
| relayer  | The admin account used in relayer to create transactions to vote or execute proposal. The relayer accounts pay gas cost when sending transactions for voting and execution in the destination chain.                                                |
| user     | The sender/recipient account that sends/receives assets. The sender account pay gas cost when approving token transfer and calling `deposit` in the Bridge contract to begin a transfer.                                                                    |

Please make sure the accounts have enough native tokens to create transactions before staring. In Polygon SDK, you can assign accounts premined balances on genesis.
