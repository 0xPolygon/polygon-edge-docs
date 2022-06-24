---
id: pos-concepts
title: Proof of Stake
---

## Overview

This section aims to give a better overview of some concepts currently present in the Proof of Stake (PoS)
implementation of the Polygon Edge.

The Polygon Edge Proof of Stake (PoS) implementation is meant to be an alternative to the existing PoA IBFT implementation,
giving node operators the ability to easily choose between the two when starting a chain.

## PoS Features

The core logic behind the Proof of Stake implementation is situated within
the [Staking Smart Contract](https://github.com/0xPolygon/staking-contracts/blob/main/contracts/staking.sol).

This contract is pre-deployed whenever a PoS mechanism Polygon Edge chain is initialized, and is available on the address
`0x0000000000000000000000000000000000001001` from block `0`.

### Epochs

Epochs are a concept introduced with the addition of PoS to the Polygon Edge.

Epochs are considered to be a special time frame (in blocks) in which a certain set of validators can produce blocks.
Their lengths are modifiable, meaning node operators can configure the length of an epoch during genesis generation.

At the end of each epoch, an _epoch block_ is created, and after that event a new epoch starts. To learn more about
epoch blocks, see the [Epoch Blocks](/docs/consensus/pos-concepts#epoch-blocks) section.

Validator sets are updated at the end of each epoch. Nodes query the validator set from the Staking Smart Contract
during the creation of the epoch block, and save the obtained data to local storage. This query and save cycle is
repeated at the end of each epoch.

Essentially, it ensures that the Staking Smart Contract has full control over the addresses in the validator set, and
leaves nodes with only 1 responsibility - to query the contract once during an epoch for fetching the latest validator
set information. This alleviates the responsibility from individual nodes from taking care of validator sets.

### Staking

Addresses can stake funds on the Staking Smart Contract by invoking the `stake` method, and by specifying a value for
the staked amount in the transaction:

````js
const StakingContractFactory = await ethers.getContractFactory("Staking");
let stakingContract = await StakingContractFactory.attach(STAKING_CONTRACT_ADDRESS)
as
Staking;
stakingContract = stakingContract.connect(account);

const tx = await stakingContract.stake({value: STAKE_AMOUNT})
````

By staking funds on the Staking Smart Contract, addresses can enter the validator set and thus be able to participate in
the block production process.

:::info Threshold for staking
Currently, the minimum threshold for entering the validator set is staking `1 ETH`
:::

### Unstaking

Addresses that have staked funds can only **unstake all of their staked funds at once**.

Unstaking can be invoked by calling the `unstake` method on the Staking Smart Contract:

````js
const StakingContractFactory = await ethers.getContractFactory("Staking");
let stakingContract = await StakingContractFactory.attach(STAKING_CONTRACT_ADDRESS)
as
Staking;
stakingContract = stakingContract.connect(account);

const tx = await stakingContract.unstake()
````

After unstaking their funds, addresses are removed from the validator set on the Staking Smart Contract, and will not be
considered validators during the next epoch.

## Epoch Blocks

**Epoch Blocks** are a concept introduced in the PoS implementation of IBFT in Polygon Edge.

Essentially, epoch blocks are special blocks that contain **no transactions** and occur only at **the end of an epoch**.
For example, if the **epoch size** is set to `50` blocks, epoch blocks would be considered to be blocks `50`, `100`
, `150` and so on.

They are used to performing additional logic that shouldn't occur during regular block production.

Most importantly, they are an indication to the node that **it needs to fetch the latest validator set** information
from the Staking Smart Contract.

After updating the validator set at the epoch block, the validator set (either changed or unchanged)
is used for the subsequent `epochSize - 1` blocks, until it gets updated again by pulling the latest information from
the Staking Smart Contract.

Epoch lengths (in blocks) are modifiable when generating the genesis file, by using a special flag `--epoch-size`:

```bash
polygon-edge genesis --epoch-size 50 ...
```

The default size of an epoch is `100000` blocks in the Polygon Edge.

## Contract pre-deployment

The Polygon Edge _pre-deploys_
the [Staking Smart Contract](https://github.com/0xPolygon/staking-contracts/blob/main/contracts/Staking.sol)
during **genesis generation** to the address `0x0000000000000000000000000000000000001001`.

It does so without a running EVM, by modifying the blockchain state of the Smart Contract directly, using the passed in
configuration values to the genesis command.
