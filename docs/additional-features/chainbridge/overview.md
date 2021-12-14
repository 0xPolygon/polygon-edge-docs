---
id: overview
title: Overview
---

ChainBridge is a modular multi-directional blockchain bridge supporting EVM and Substrate compatible chains. It allows users to transfer whatever kind of assets or messages to another chain.

To find out more about ChainBridge, visit the [official docs](https://chainbridge.chainsafe.io/).

## Architecture

In ChainBridge, there are three types of contracts called Bridge/Handler/Target in each chain and relayers to communicate between chains.

### Bridge contract

A Bridge contract that manages requests, votes, executions needs to be deployed in each chain. Users will call `deposit` in Bridge to start a transfer and Bridge delegates the process to Handler contract corresponding to Target contract. Once Handler contract has been successful in call Target contract, Bridge contract emits `Deposit` event to notify relayers.

### Handler contract

Handler contract interacts with Target contract to execute deposit or proposal. It validates the user's request, calls Target contract and manages deposit records and some settings for Target contract. There are some Handler contracts to call each Target contract that has a different interface. The indirect calls by Handler contract make the bridge enable to transfer whatever kind of assets or data.

Currently, there are three types of Handler contracts implemented by ChainBridge: ERC20Handler, ERC721Handler, and GenericHandler.

### Target contract

A contract that manages assets to be exchanged or processes messages to be transferred between chains.

### Relayer

Relayer is an application that monitors events from every chain and votes for a proposal in the Bridge contract of the destination chain when it receives `Deposit` event from a chain. A relayer calls a method in the Bridge contract to execute the proposal after the required number of votes are submitted. Bridge delegates execution to Handler contract.

<div style={{textAlign: 'center'}}>

![ChainBridge Architecture](/img/chainbridge/architecture.svg)
*ChainBridge Architecture*

</div>

<div style={{textAlign: 'center'}}>

![Workflow of ERC20 token transfer](/img/chainbridge/erc20-workflow.svg)
*ex. Workflow of ERC20 token transfer*

</div>
