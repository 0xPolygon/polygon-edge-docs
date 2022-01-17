---
id: query-json-rpc
title: Query JSON RPC endpoints
---

## Overview

The JSON-RPC layer of the Polygon Edge provides developers with the functionality of easily interacting with the blockchain,
through HTTP requests.

This example covers using tools like **curl** to query information, as well as starting the chain with a premined account,
and sending a transaction.

## Step 1: Create a genesis file with a premined account

To generate a genesis file, run the following command:
````bash
polygon-edge genesis --premine 0x1010101010101010101010101010101010101010
````

The **premine** flag sets the address that should be included with a starting balance in the **genesis** file.<br />
In this case, the address `0x1010101010101010101010101010101010101010` will have a starting **default balance** of 
`0x3635C9ADC5DEA00000 wei`.

If we wanted to specify a balance, we can separate out the balance and address with a `:`, like so:
````bash
polygon-edge genesis --premine 0x1010101010101010101010101010101010101010:0x123123
````

The balance can be either a `hex` or `uint256` value.

## Step 2: Start the Polygon Edge in dev mode

To start the SDK in development mode, which is explained in the [CLI Commands](/docs/get-started/cli-commands) section, 
run the following: 
````bash
polygon-edge server --chain genesis.json --dev --log-level debug
````

## Step 3: Query the account balance

Now that the client is up and running in dev mode, using the genesis file generated in **step 1**, we can use a tool like 
**curl** to query the account balance:
````bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x1010101010101010101010101010101010101010", "latest"],"id":1}' localhost:8545
````

The command should return the following output:
````bash
{
  "id":1,
  "result":"0x100000000000000000000000000"
}
````

## Step 4: Send a transfer transaction

Now that we've confirmed the account we set up as premined has the correct balance, we can transfer some ether:

````bash
polygon-edge txpool add --nonce 0 --from 0x1010101010101010101010101010101010101010 --to 0x0000000000000000000000000000000000000010 --value 0x100
````

The **txpool add** command adds the transaction to the transaction pool.

In this case, the transfer is from `0x1010101010101010101010101010101010101010` to `0x0000000000000000000000000000000000000010`, with the value being `0x100` wei.
