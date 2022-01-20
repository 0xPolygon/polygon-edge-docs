---
id: migration-to-pos
title: Migration from PoA to PoS
---

## Overview

This section guides you through migration from PoA to PoS for the running cluster without reset of blockchain.

## How to migrate to PoS

You will need to stop all nodes, update genesis.json, and restart the nodes in order to switch to PoS. `ibft switch` command append fork configuration into `genesis.json`.

````bash
polygon-edge ibft switch --chain ./genesis.json --type PoS --deployment 100 --from 200
````

To switch to PoS, you will need to specify 2 block heights: `deployment` and `from`. `deployment` is the height to deploy the staking contract and `from` is the height of beginning of PoS. The staking contract will be deployed at the address `0x0000000000000000000000000000000000001001`  at the `deployment`, like as the case of pre-deployed contract.

Each validator needs to stake after contract is deployed at `deployment` and before `from` in order to be a validator at the beginning of PoS. Each validator will update own validator set by the set in the staking contract at the beginning of PoS.
