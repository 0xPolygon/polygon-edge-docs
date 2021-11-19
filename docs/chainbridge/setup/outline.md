---
id: outline
title: Outline
---

This guide walks through the setup for a bridge between a running Polygon PoS network and a local Polygon SDK network.

## Requirements

In this guide, you will run PolygonSDK nodes, ChainBridge relayer, and cb-sol-cli tool which is a CLI tool to deploy contracts locally. The following environments are required before starting setup.

* Go: >= 1.16
* Node.js >= 16.13.0
* Git

In addition, you need to clone the following repositories with the versions to run some applications.

* [Polygon SDK](https://github.com/0xPolygon/polygon-sdk.git): `6efebc6` on `develop` branch
* [ChainBridge](https://github.com/ChainSafe/ChainBridge): `9585bc8` on `main` branch
* [ChainBridge Deploy Tools](https://github.com/ChainSafe/chainbridge-deploy): `f2aa093` on `main` branch
