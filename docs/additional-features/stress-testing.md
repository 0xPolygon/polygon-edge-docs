---
id: stress-testing
title: Network stress testing
---

## Prerequisites

This guide assumes that:

- You have a working polygon-sdk network up and running (using IBFT or dev)
- Both your JSON-RPC endpoints are reachable
- For each of the sender accounts you use, its private key must be saved as an environment variable with the following format:
  - PSDK_ADDRESS=PRIVATE_KEY
- Each sender account must have the required funds on it to execute a single loadbot run

e.g. to export the variable :

```bash
export PSDK_0x9A2E59d06899a383ef47C1Ec265317986D026055=154c4bc0cca942d8a0b49ece04d95c872d8f53d34b8f2ac76253a3700e4f1151
```

## Start the loadbot

_Feel free to take a look at the flag reference [here](/docs/get-started/cli-commands#loadbot-flags)_.

As an example, here is a valid command you can use to run the loadbot using two premined accounts and an IBFT setup:
```bash
polygon-sdk loadbot  --jsonrpc http://127.0.0.1:10002 --sender 0x9A2E59d06899a383ef47C1Ec265317986D026055 --receiver 0x9876e8b849437703A34808e926a8a5B48bCb3ccf --count 100 --value 0x100 --tps 100
```

You should get a result similar to this on your terminal :
```bash
=====[LOADBOT RUN]=====

[COUNT DATA]
Transactions submitted = 2000
Transactions failed    = 0

[TURN AROUND DATA]
Average transaction turn around = 3.490800s
Fastest transaction turn around = 2.002320s
Slowest transaction turn around = 5.006770s
Total loadbot execution time    = 24.009350s

[BLOCK DATA]
Blocks required = 11

Block #223 = 120 txns
Block #224 = 203 txns
Block #225 = 203 txns
Block #226 = 202 txns
Block #227 = 201 txns
Block #228 = 199 txns
Block #229 = 200 txns
Block #230 = 199 txns
Block #231 = 201 txns
Block #232 = 200 txns
Block #233 = 72 txns
```