---
id: stress-testing
title: Network stress testing
---

## Prerequisites

This guide assumes that:

- You have a working polygon-sdk network up and running (using IBFT or dev)
- Both your JSON-RPC and gRPC endpoints are reachable
- For each of the accounts you use, its private key must be saved as an environment variable with the following format:
  - PSDK_ADDRESS=PRIVATE_KEY

e.g. to export the variable :

```bash
export PSDK_0x9876e8b849437703A34808e926a8a5B48bCb3ccf=07eb13980486964e7e6f1172e0ed65a18117a74ac49503d2878b980ae224e90a
```

## Start the loadbot

_Feel free to take a look at the flag reference [here](/docs/get-started/cli-commands#loadbot-flags)_.

As an example, here is a valid command you can use to run the loadbot using two premined accounts and an IBFT setup:
```bash
polygon-sdk loadbot  --jsonrpc http://127.0.0.1:10002 --sender 0xE696952149F3e17A3F2EcD4672207CcF7Df00096 --receiver 0x9876e8b849437703A34808e926a8a5B48bCb3ccf --count 10 --value 0x100 --tps 100
```

You should get a result similar to this on your terminal :
```bash
[LOADBOT RUN]
Transactions submitted = 10
Transactions failed    = 0
Duration               = 10.035877088s
```