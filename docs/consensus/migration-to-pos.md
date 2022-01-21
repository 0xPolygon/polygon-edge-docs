---
id: migration-to-pos
title: Migration from PoA to PoS
---

## Overview

This section guides you through the migration from PoA to PoS IBFT modes, and vice versa, for a running cluster - without the need to reset the blockchain.

## How to migrate to PoS

You will need to stop all nodes, add fork configuration into genesis.json by `ibft switch` command, and restart the nodes.

````bash
polygon-edge ibft switch --chain ./genesis.json --type PoS --deployment 100 --from 200
````

To switch to PoS, you will need to specify 2 block heights: `deployment` and `from`. `deployment` is the height to deploy the staking contract and `from` is the height of beginning of PoS. The staking contract will be deployed at the address `0x0000000000000000000000000000000000001001`  at the `deployment`, like as the case of pre-deployed contract.

Please check [Proof of Stake](/docs/consensus/pos-concepts) for more details about Staking contract.

:::warning Validators need to stake manually
Each validator needs to stake after contract is deployed at `deployment` and before `from` in order to be a validator at the beginning of PoS. Each validator will update own validator set by the set in the staking contract at the beginning of PoS.

To find out more about Staking, visit the [Set up and use Proof of Stake ](/docs/consensus/pos-stake-unstake).
:::
