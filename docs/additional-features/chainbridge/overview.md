---
id: overview
title: Overview
---

## What is ChainBridge?

ChainBridge is a modular multi-directional blockchain bridge supporting EVM and Substrate compatible chains, built by ChainSafe. It allows users to transfer all kinds of assets or messages between two different chains.

To find out more about ChainBridge, please first visit the [official docs](https://chainbridge.chainsafe.io/) provided by its developers.

This guide is intended to help with the Chainbridge integration to Polygon Edge. It walks through the setup of a bridge between a running Polygon PoS (Mumbai testnet) and a local Polygon Edge network. 

## Requirements

In this guide, you will run Polygon Edge nodes, a ChainBridge relayer (more about it  [here](/docs/additional-features/chainbridge/definitions)), and the cb-sol-cli tool, which is a CLI tool to deploy contracts locally, registering resource, and changing settings for the bridge (you can check [this](https://chainbridge.chainsafe.io/cli-options/#cli-options) too). The following environments are required before starting the setup:

* Go: >= 1.17 
* Node.js >= 16.13.0
* Git


In addition, you will need to clone the following repositories with the versions to run some applications.

* [Polygon Edge](https://github.com/0xPolygon/polygon-edge): on the `develop` branch
* [ChainBridge](https://github.com/ChainSafe/ChainBridge): v1.1.5
* [ChainBridge Deploy Tools](https://github.com/ChainSafe/chainbridge-deploy): `f2aa093` on `main` branch


You need to set up a Polygon Edge network before proceeding to the next section. Please check [Local Setup](/docs/get-started/set-up-ibft-locally) or [Cloud Setup](/docs/get-started/set-up-ibft-on-the-cloud) for more details.