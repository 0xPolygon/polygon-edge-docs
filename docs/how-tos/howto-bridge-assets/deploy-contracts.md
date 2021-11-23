---
id: deploy-contracts
title: Deploy Contracts
---

In this section, you will deploy required contracts to Polygon PoS and Polygon SDK chain with `cb-sol-cli`.

```bash
# Setup for cb-sol-cli command
$ git clone https://github.com/ChainSafe/chainbridge-deploy.git
$ cd chainbridge-deploy/cb-sol-cli
$ make install
```

Firstly, we will deploy contracts to Polygon PoS chain by `cb-sol-cli deploy` command. `--all` flag makes the command deploy all contracts including Bridge, ERC20 Handler, ERC721 Handler, Generic Handler, ERC20, and ERC721 contract. In addition, it'll set the default relayer account address and the threshold.

```bash
# Deploy all required contracts into Polygon PoS chain
$ cb-sol-cli deploy --all --chainId 99 \
  --url https://rpc-mumbai.matic.today \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --relayers [RELAYER_ACCOUNT_ADDRESS] \
  --relayerThreshold 1
```

:::info ChainID

You will need to specify the `chainId` to deploy the Bridge contract. The `chainId` is an arbitrary value used for differentiating between blockchain networks and needs only to be unique, not to be the same as the chain's ID (since 2 networks might have the same one). In this example we set the `99` in `chainId`, because the chain ID of Mumbai testnet is `80001` which cannot be represented with a uint8.

:::

:::info JSON-RPC URL for Polygon PoS

`https://rpc-mumbai.matic.today` is a public JSON-RPC URL provided by Polygon, which may have traffic or rate-limits. We advise you to obtain your JSON-RPC URL by an external service like `Infura` because deploying contracts will send many queries/requests to the JSON-RPC.
:::

:::caution

The default gas price in `cb-sol-cli` is `20000000` (`0.02 Gwei`). To set appropriate gas price in transaction, please set the value using the `--gasPrice` argument.

```bash
$ cb-sol-cli deploy --all --chainId 99 \
  --url https://rpc-mumbai.matic.today \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --relayers [RELAYER_ACCOUNT_ADDRESS] \
  --relayerThreshold 1 \
  # Set gas price to 5 Gwei
  --gasPrice 5000000000
```

:::

Once the contracts have been deployed, you will get the following result:

```bash
Deploying contracts...
✓ Bridge contract deployed
✓ ERC20Handler contract deployed
✓ ERC721Handler contract deployed
✓ GenericHandler contract deployed
✓ ERC20 contract deployed
WARNING: Multiple definitions for safeTransferFrom
✓ ERC721 contract deployed

================================================================
Url:        https://rpc-mumbai.matic.today
Deployer:   <ADMIN_ACCOUNT_ADDRESS>
Gas Limit:   8000000
Gas Price:   20000000
Deploy Cost: 0.00029065308

Options
=======
Chain Id:    <CHAIN_ID>
Threshold:   <RELAYER_THRESHOLD>
Relayers:    <RELAYER_ACCOUNT_ADDRESS>
Bridge Fee:  0
Expiry:      100

Contract Addresses
================================================================
Bridge:             <BRIDGE_CONTRACT_ADDRESS>
----------------------------------------------------------------
Erc20 Handler:      <ERC20_HANDLER_CONTRACT_ADDRESS>
----------------------------------------------------------------
Erc721 Handler:     <ERC721_HANDLER_CONTRACT_ADDRESS>
----------------------------------------------------------------
Generic Handler:    <GENERIC_HANDLER_CONTRACT_ADDRESS>
----------------------------------------------------------------
Erc20:              <ERC20_CONTRACT_ADDRESS>
----------------------------------------------------------------
Erc721:             <ERC721_CONTRACT_ADDRESS>
----------------------------------------------------------------
Centrifuge Asset:   Not Deployed
----------------------------------------------------------------
WETC:               Not Deployed
================================================================
```

Now we may deploy the contracts to the Polygon SDK chain.

```bash
# Deploy all required contracts into Polygon SDK chain
$ cb-sol-cli deploy --all --chainId 100 \
  --url http://localhost:10002 \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --relayers [RELAYER_ACCOUNT_ADDRESS] \
  --relayerThreshold 1
```

Save the terminal outputs with the deployed smart contract addresses as we will need them for the next step.
