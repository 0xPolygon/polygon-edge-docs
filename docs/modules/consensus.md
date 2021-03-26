---
id: consensus
title: Consensus
---

## Overview

The **Consensus** module provides an interface for consensus mechanisms.

Currently, the following consensus engines are being worked on:
* **Clique**    (⚠️**WIP**)
* **Ethash**    (⚠️**WIP**)
* **IBFT**      (⚠️**WIP**)
* **PoW**

:::caution Work in progress
The **Sealer** and the **Consensus** modules will be combined into a single entity in the near future.

The new module will incorporate modular logic for different kinds of consensus mechanisms, which require different sealing implementations:
* **PoS** (Proof of Stake)
* **PoA** (Proof of Authority)

Currently, the **Sealer** and the **Consensus** modules work with PoW (Proof of Work).
:::