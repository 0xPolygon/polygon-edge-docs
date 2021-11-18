---
id: howto-run-loadbot 
title: How to run the loadbot for stress testing your network
---

## Prerequisites

This how-to assumes that:

- You have a working polygon-sdk network up and running (using IBFT or dev)
- Both your JSON-RPC and gRPC endpoints are reachable

## Start the loadbot

_Feel free to take a look at the flag reference [here](../cli-commands.mdx)_.

As an example, here is a valid command you can use to run the loadbot using a dev node:
```bash
go run main.go loadbot --url http://127.0.0.1:8545 --grpc 127.0.0.1:9632 --account 0x1010101010101010101010101010101010101010 --account 0x1010101010101010101010101010101010101020 --count 2000 --value 10000000000000000 --gasLimit 524288 --tps 200
```

You should get a result similar to this on your terminal :
```bash
[LOADBOT RUN]
Transactions submitted = 2000
Transactions failed    = 0
Duration               = 10.035877088s
```