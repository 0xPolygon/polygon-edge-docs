---
id: howto-run-loadbot 
title: How to run the loadbot for stress testing your network
---

## Prerequisites

This how-to assumes you have followed
the [guide on how to set up an IBFT cluster locally](/docs/how-tos/howto-setup-ibft/howto-set-ibft-locally)
or [guide on how to set up an IBFT cluster on the cloud](/docs/how-tos/howto-setup-ibft/howto-set-ibft-on-the-cloud).
The loadbot also works when using dev mode.

A functioning node is required to stress test the network.

When building a network using the Polygon SDK, you may want to test how many transactions your configuration can handle
per second, or how your network will react when you submit valid and invalid transactions.

The Polygon SDK binary includes a `loadbot` command, responsible for sending a specific number of transactions per
second.

This _how-to_ will explain how to run the loadbot on a single node configuration using 2 accounts prefilled with a
balance of 1000 ETH each.

:::note

This is not the only parameter you can specify when running the loadbot.

:::

## Step 1: Create a genesis file with a premined account

To generate a genesis file, run the following command:

````bash
go run main.go genesis --premine 0x1010101010101010101010101010101010101010 --premine 0x1010101010101010101010101010101010101020
````

The **premine** flag sets the address that should be included with a starting balance in the **genesis** file.<br />
In this case, the addresses `0x1010101010101010101010101010101010101010` and
`0x1010101010101010101010101010101010101020` will have a starting **default balance** of
`0x3635C9ADC5DEA00000 wei`.

## Step 2: Start the Polygon SDK in dev mode

To start the SDK in development mode, which is explained in the [CLI Commands](/docs/cli-commands) section, run the
following command:

````bash
go run main.go server --chain genesis.json --dev --log-level debug
````

## Step 3: Start the loadbot

The loadbot supports the following parameters :

- **tps**: The number of transaction per second sent by the loadbot
- **account**: One account used by the loadbot. You may want to specify more accounts to test the chain state after 
  the loadbot run
- **gasLimit**: The transaction's gas
- **gasPrice**: The transaction's gas price
- **url**: The JSON RPC endpoint used to submit the transactions. If more endpoints are provided, transactions will 
  be submitted using each endpoint one after another
- **chainId**: The transaction's chain ID
- **count**: The number of transactions to send
- **value**: The amount of ether (in wei) sent in every transaction
- **grpc**: The gRPC endpoint of one of the node, used to verify if all transactions have been processed

As an example, here is a valid command you can use to run the loadbot using the node we started in step 2:
```bash
go run main.go loadbot --url http://127.0.0.1:8545 --grpc 127.0.0.1:9632 --account 
0x1010101010101010101010101010101010101010 --account 0x1010101010101010101010101010101010101020 --count 2000 --value 10000000000000000 --gasLimit 524288 --tps 200
```

You should get a result similar to this on your terminal :
```bash
[LOADBOT RUN]
Transactions submitted = 2000
Transactions failed    = 0
Duration               = 10.035877088s
```