---
id: pos-concepts
title: Proof of Stake
---

## Overview

This section aims to give a better overview of some concepts currently present in the Proof of Stake (PoS) implementation of 
the Polygon SDK.

## Epoch Blocks

**Epoch Blocks** are a concept introduced in the PoS implementation of IBFT in Polygon SDK.

Essentially, epoch blocks are special blocks that contain **no transactions** and occur only at **the end of an epoch**.
For example, if the **epoch size** is set to `50` blocks, epoch blocks would be considered to be blocks `50`, `100`, `150` and so on.

They are used to performing additional logic that shouldn't occur during regular block production. 

Most importantly, they are an indication to the node that **it needs to fetch the latest validator set** information
from the Staking Smart Contract. 

After updating the validator set at the epoch block, the validator set (either changed or unchanged)
is used for the subsequent `epochSize - 1` blocks, until it gets updated again by pulling the latest information from the
Staking Smart Contract.

Epoch lengths (in blocks) are modifiable when generating the genesis file, by using a special flag `--epoch-size`:
```bash
polygon-sdk genesis --epoch-size 50 ...
```

The default size of an epoch is `100000` blocks in the Polygon SDK.

## Contract pre-deployment

The Polygon SDK _pre-deploys_ the [Staking Smart Contract](https://github.com/0xPolygon/staking-contracts/blob/main/contracts/staking.sol)
during **genesis generation** to the address `0x0000000000000000000000000000000000001001`.

It does so without a running EVM, by modifying the blockchain state of the Smart Contract directly, using the passed
in configuration values to the genesis command.
