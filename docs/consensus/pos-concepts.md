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
go run main.go genesis --epoch-size 50 ...
```

The default size of an epoch is `100000` blocks in the Polygon SDK.

## Contract pre-deployment

The Polygon SDK _pre-deploys_ the [Staking Smart Contract](https://github.com/0xPolygon/staking-contracts/blob/main/contracts/staking.sol)
during **genesis generation** to the address `0x0000000000000000000000000000000000001001`.

It does so without a running EVM, by modifying the blockchain state of the Smart Contract directly:
````go title="helper/staking/staking.go"
// PredeployStakingSC is a helper method for setting up the staking smart contract account,
// using the passed in validators as prestaked validators
func PredeployStakingSC(
    premineMap map[types.Address]*chain.GenesisAccount,
    validators []types.Address,
    ) error {
    // Set the code for the staking smart contract
    // Code retrieved from https://github.com/0xPolygon/staking-contracts
    scHex, _ := hex.DecodeHex(StakingSCBytecode)
    stakingAccount := &chain.GenesisAccount{
		Code: scHex,
    }
    
    // Parse the default staked balance value into *big.Int
    val := DefaultStakedBalance
    bigDefaultStakedBalance, err := types.ParseUint256orHex(&val)
    if err != nil {
        return fmt.Errorf("unable to generate DefaultStatkedBalance, %v", err)
    }
    
    // Generate the empty account storage map
    storageMap := make(map[types.Hash]types.Hash)
    bigTrueValue := big.NewInt(1)
    stakedAmount := big.NewInt(0)
    for indx, validator := range validators {
        // Update the total staked amount
        stakedAmount.Add(stakedAmount, bigDefaultStakedBalance)
        
        // Get the storage indexes
        storageIndexes := GetStorageIndexes(validator, int64(indx))
        
        // Set the value for the validators array
        storageMap[types.BytesToHash(storageIndexes.ValidatorsIndex)] = types.BytesToHash(
            validator.Bytes(),
        )
        
        // Set the value for the address -> validator array index mapping
        storageMap[types.BytesToHash(storageIndexes.AddressToIsValidatorIndex)] = types.BytesToHash(bigTrueValue.Bytes())
        
        // Set the value for the address -> staked amount mapping
        storageMap[types.BytesToHash(storageIndexes.AddressToStakedAmountIndex)] = types.StringToHash(hex.EncodeBig(bigDefaultStakedBalance))
        
        // Set the value for the address -> validator index mapping
        storageMap[types.BytesToHash(storageIndexes.AddressToValidatorIndexIndex)] = types.StringToHash(hex.EncodeUint64(uint64(indx)))
        
        // Set the value for the total staked amount
        storageMap[types.BytesToHash(storageIndexes.StakedAmountIndex)] = types.BytesToHash(stakedAmount.Bytes())
        
        // Set the value for the size of the validators array
        storageMap[types.BytesToHash(storageIndexes.ValidatorsArraySizeIndex)] = types.StringToHash(hex.EncodeUint64(uint64(indx + 1)))
	}
    
    // Save the storage map
    stakingAccount.Storage = storageMap
    
    // Set the Staking SC balance to numValidators * defaultStakedBalance
    stakingAccount.Balance = stakedAmount
    
    // Add the account to the premine map so the executor can apply it to state
    premineMap[types.StringToAddress("1001")] = stakingAccount
    
    return nil
}
````