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
| Handler contract  | This contract interacts with the Target contract to execute a deposit or proposal. It validates the user's request, calls the Target contract and helps with some settings for the Target contract. There are certain Handler contracts to call each Target contract that has a different interface. The indirect calls by the Handler contract make the bridge to enable the transfer of whatever kind of assets or data. Currently, there are three types of Handler contracts implemented by ChainBridge: ERC20Handler, ERC721Handler, and GenericHandler.                                                |
| Target contract   | A contract that manages assets to be exchanged or the messages that are transferred between chains. The interaction with this contract will be made from each side of the bridge.                                                                    |

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
| Admin  | This account will be given the admin role as default. |
| User   | The sender/recipient account that sends/receives assets. The sender account pays the gas fees when approving token transfers and calling deposit in the Bridge contract to begin a transfer.                                                             |

:::info The admin role
Certain actions can only be performed by the admin role account. By default, the deployer of the Bridge contract has the admin role. You will find below how to grant the admin role to another account or to remove it.

### Add admin role

Adds an admin

```bash
# Grant admin role
$ cb-sol-cli admin add-admin \
  --url [JSON_RPC_URL] \
  --privateKey [PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --admin "[NEW_ACCOUNT_ADDRESS]"
```
### Revoke admin role

Removes an admin

```bash
# Revoke admin role
$ cb-sol-cli admin remove-admin \
  --url [JSON_RPC_URL] \
  --privateKey [PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --admin "[NEW_ACCOUNT_ADDRESS]"
```

## The operations which are allowed by the `admin` account are as below.

### Set Resource

Register a resource ID with a contract address for a handler.

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

Set a token contract as mintable/burnable in a handler.

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

The Chainbridge `chainId` is an arbitrary value used in the bridge for differentiating between the blockchain networks, and it has to be in the range of uint8. To not be confused with the chain ID of the network, they are not the same thing. This value needs to be unique, but it doesn't have to be the same as the ID of the network.

In this example, we set  `99` in `chainId`, because the chain ID of the Mumbai testnet is `80001`, which cannot be represented with a uint8.

## Resource ID

A resource ID is a unique 32-bytes value in a cross-chain environment, associated with a certain asset (resource) that is being transferred between networks.

The resource ID is arbitrary, but, as a convention, usually the last byte contains the chain ID of the source chain (the network from which this asset originated from). 

## JSON-RPC URL for Polygon PoS

For this guide, we’ll use https://rpc-mumbai.matic.today, a public JSON-RPC URL provided by Polygon, which may have traffic or rate-limits. This will be used only to connect with the Polygon Mumbai testnet. We advise you to obtain your JSON-RPC URL by an external service like Infura because deploying contracts will send many queries/requests to the JSON-RPC.

## Ways of processing the transfer of tokens
When transferring ERC20 tokens between chains, they can be processed in two different modes:

### Lock/release mode
<b>Source chain: </b>The tokens you are sending will be locked in the Handler Contract.  <br/>
<b>Destination chain:</b> The same amount of tokens as you sent in the source chain would be unlocked and transferred from the Handler contract to the recipient account in the destination chain.

### Burn/mint mode
<b>Source chain:</b> The tokens you are sending will be burned.   <br/>
<b>Destination chain:</b> The same amount of tokens that you sent and burned on the source chain will be minted on the destination chain and sent to the recipient account.

You can use different modes on each chain. It means that you can lock a token in the main chain while minting a token in the subchain for transfer. For instance, it may make sense to lock/release tokens if the total supply or mint schedule is controlled. Tokens would be minted/burned if the contract in the subchain has to follow the supply in the main chain.

The default mode is lock/release mode. If you want to make the Tokens mintable/burnable, you need to call `adminSetBurnable` method. If you want to mint tokens on execution, you will need to grant `minter` role to the ERC20 Handler contract.


