---
id: definitions
title: General Definitions
---


## Relayer
Chainbridge is a relayer type bridge. The role of a relayer is to vote for the execution of a request (how many tokens to burn/release, for example).
It monitors events from every chain, and votes for a proposal in the Bridge contract of the destination chain when it receives a `Deposit` event from a chain. A relayer calls a method in the Bridge contract to execute the proposal after the required number of votes are submitted. The bridge delegates execution to the Handler contract.


## Types of contracts
In ChainBridge, there are three types of contracts on each chain, called Bridge/Handler/Target.

| **Type** |**Description**                                                                                                                |
|----------|-------------------------------------------------------------------------------------------------------------------------------|
| Bridge contract   | A Bridge contract that manages requests, votes, executions needs to be deployed in each chain. Users will call `deposit` in Bridge to start a transfer, and Bridge delegates the process to the Handler contract corresponding to the Target contract. Once the Handler contract has been successful in calling the Target contract, Bridge contract emits a `Deposit` event to notify relayers.|
| Handler contract  | The account used in the relayer to create transactions to vote or execute a proposal. The relayer accounts pay gas fees when sending transactions for voting and execution in the destination chain.                                                 |
| Target contract   | The sender/recipient account that sends/receives assets. The sender account pays the gas fees when approving token transfers and calling `deposit` in the Bridge contract to begin a transfer.                                                                    |

<div style={{textAlign: 'center'}}>

![ChainBridge Architecture](/img/chainbridge/architecture.svg)
*ChainBridge Architecture*

</div>

<div style={{textAlign: 'center'}}>

![Workflow of ERC20 token transfer](/img/chainbridge/erc20-workflow.svg)
*ex. Workflow of an ERC20 token transfer*

</div>

## Types of accounts

Please make sure the accounts have enough native tokens to create transactions before starting. In Polygon Edge, you can assign premined balances to accounts when generating the genesis block.

| **Type** |**Description**                                                                                                                |
|----------|-------------------------------------------------------------------------------------------------------------------------------|
| Admin  |The account that deploys the Bridge contract. This account will be given the admin role as default and will be able to do certain actions in Bridge. The admin account pays the gas fees when deploying contracts, registering resource IDs, updating settings in the contracts, or minting tokens.|
| Relayer | The account used in the relayer to create transactions to vote or execute a proposal. The relayer accounts pay gas fees when sending transactions for voting and execution in the destination chain.|
| User   | The sender/recipient account that sends/receives assets. The sender account pays the gas fees when approving token transfers and calling deposit in the Bridge contract to begin a transfer.                                                             |

:::info The admin role
Certain actions can only be performed by the admin role account. By default, the deployer of the Bridge contract has the admin role. You will find below how to grant the admin role to another account or to remove it.

The operations which are allowed by the admin account are as below:

```bash
# Grant admin role
$ cb-sol-cli admin add-admin \
  --url [JSON_RPC_URL] \
  --privateKey [PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --addmin "[NEW_ACCOUNT_ADDRESS]"

# Revoke admin role
$ cb-sol-cli admin remove-admin \
  --url [JSON_RPC_URL] \
  --privateKey [PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --addmin "[NEW_ACCOUNT_ADDRESS]"
```

The operations which are allowed by the `admin` account are as below.

### Set Resource

```bash
# Register new resource
$ cb-sol-cli bridge register-resource \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --resourceId "[RESOURCE_ID]" \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --handler "[HANDLER_CONTRACT_ADDRESS]" \
  --targetContract "[TARGET_CONTRACT_ADDRESS]"
```

### Make contract burnable/mintable

```bash
# Let contract burnable/mintable
$ cb-sol-cli bridge set-burn \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --handler "[HANDLER_CONTRACT_ADDRESS]" \
  --tokenContract "[TARGET_CONTRACT_ADDRESS]"
```

### Cancel proposal

Cancel proposal for execution

```bash
# Cancel ongoing proposal
$ cb-sol-cli bridge cancel-proposal \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --resourceId "[RESOURCE_ID]" \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --chainId "[CHAIN_ID_OF_SOURCE_CHAIN]" \
  --depositNonce "[NONCE]"
```

### Pause/Unpause

Pause deposits, proposal creation, voting, and deposit executions temporally.

```bash
# Pause
$ cb-sol-cli admin pause \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]"

# Unpause
$ cb-sol-cli admin unpause \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]"
```

### Change Fee

Change the fee which will be paid to Bridge Contract

```bash
# Change fee for execution
$ cb-sol-cli admin set-fee \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --fee [FEE_IN_WEI]
```

### Add/Remove a relayer

Add an account as a new relayer or remove an account from relayers

```bash
# Add relayer
$ cb-sol-cli admin add-relayer \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --relayer "[NEW_RELAYER_ADDRESS]"
  
# Remove relayer
$ cb-sol-cli admin remove-relayer \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --relayer "[RELAYER_ADDRESS]"
```

### Change relayer threshold

Change the number of votes required for a proposal execution

```bash
# Remove relayer
$ cb-sol-cli admin set-threshold \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --threshold [THRESHOLD]
```
:::

## Chain ID

The Chainbridge `chainId` is an arbitrary value used in the bridge for differentiating between the blockchain networks. To not be confused with the chain ID of the network, they are not the same thing. This value needs to be unique (not the same as the chain ID of the network), since two networks might have the same one.

In this example, we set  `99` in `chainId`, because the chain ID of the Mumbai testnet is `80001`, which cannot be represented with a uint8.

## Resource ID

A resource ID is a unique 32-byte value in a cross-chain environment, associated with a certain asset (resource) that is being transferred between networks.

The resource ID is arbitrary, but, as a convention, usually the last byte contains the chain ID of the source chain (the network from which this asset originated from). For example, let’s say we have a certain token that is transferred between two networks, Network1 and Network2. On Network1, the resource ID would be tokenA, and, for Network2, the equivalent would be tokenB (A and B being the last byte containing the ID of the source chain).

## JSON-RPC URL for Polygon PoS

For this guide, we’ll use https://rpc-mumbai.matic.today, a public JSON-RPC URL provided by Polygon, which may have traffic or rate-limits. We advise you to obtain your JSON-RPC URL by an external service like Infura because deploying contracts will send many queries/requests to the JSON-RPC.

