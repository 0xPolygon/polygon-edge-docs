---
id: stress-testing
title: Network stress testing
---

## Prerequisites

This guide assumes that:

- You have a working polygon-sdk network up and running (using IBFT or dev)
- Both your JSON-RPC and gRPC endpoints are reachable
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
[LOADBOT RUN]
Transactions submitted          = 100
Transactions failed             = 0
Average transaction turn around = 0.994750s
Fastest transaction turn around = 0.002480s
Slowest transaction turn around = 1.007960s
Total loadbot execution time    = 2.003250s
```