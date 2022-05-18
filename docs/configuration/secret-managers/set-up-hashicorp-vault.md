---
id: set-up-hashicorp-vault
title: Set up Hashicorp Vault
---

## Overview

Currently, the Polygon Edge is concerned with keeping 2 major runtime secrets:
* The **validator private key** used by the node, if the node is a validator
* The **networking private key** used by libp2p, for participating and communicating with other peers

For additional information, please read through the [Managing Private Keys Guide](/docs/configuration/manage-private-keys)

The modules of the Polygon Edge **should not need to know how to keep secrets**. Ultimately, a module should not care if 
a secret is stored on a far-away server or locally on the node's disk.

Everything a module needs to know about secret-keeping is **knowing to use the secret**, **knowing which secrets to get 
or save**. The finer implementation details of these operations are delegated away to the `SecretsManager`, which of course is an abstraction.

The node operator that's starting the Polygon Edge can now specify which secrets manager they want to use, and as soon 
as the correct secrets manager is instantiated, the modules deal with the secrets through the mentioned interface - 
without caring if the secrets are stored on a disk or on a server.

This article details the necessary steps to get the Polygon Edge up and running with a [Hashicorp Vault](https://www.vaultproject.io/) server.

:::info previous guides
It is **highly recommended** that before going through this article, articles on [**Local Setup**](/docs/get-started/set-up-ibft-locally) 
and [**Cloud Setup**](/docs/get-started/set-up-ibft-on-the-cloud) are read.
:::


## Prerequisites

This article assumes that a functioning instance of the Hashicorp Vault server **is already set up**.

Additionally, it is required that the Hashicorp Vault server being used for the Polygon Edge should have **enabled KV storage**.

Required information before continuing:
* **The server URL** (the API URL of the Hashicorp Vault server)
* **Token** (access token used for access to the KV storage engine)

## Step 1 - Generate the secrets manager configuration

In order for the Polygon Edge to be able to seamlessly communicate with the Vault server, it needs to parse an already
generated config file, which contains all the necessary information for secret storage on Vault.

To generate the configuration, run the following command:

```bash
polygon-edge secrets generate --dir <PATH> --token <TOKEN> --server-url <SERVER_URL> --name <NODE_NAME>
```

Parameters present:
* `PATH` is the path to which the configuration file should be exported to. Default `./secretsManagerConfig.json`
* `TOKEN` is the access token previously mentioned in the [prerequisites section](/docs/configuration/secret-managers/set-up-hashicorp-vault#prerequisites)
* `SERVER_URL` is the URL of the API for the Vault server, also mentioned in the [prerequisites section](/docs/configuration/secret-managers/set-up-hashicorp-vault#prerequisites)
* `NODE_NAME` is the name of the current node for which the Vault configuration is being set up as. It can be an arbitrary value. Default `polygon-edge-node`

:::caution Node names
Be careful when specifying node names.

The Polygon Edge uses the specified node name to keep track of the secrets it generates and uses on the Vault instance.
Specifying an existing node name can have consequences of data being overwritten on the Vault server.

Secrets are stored on the following base path: `secrets/node_name`
:::

## Step 2 - Initialize secret keys using the configuration

Now that the configuration file is present, we can initialize the required secret keys with the configuration 
file set up in step 1, using the `--config`:

```bash
polygon-edge secrets init --config <PATH>
```

The `PATH` param is the location of the previously generated secrets manager param from step 1.

## Step 3 - Generate the genesis file

The genesis file should be generated in a similar manner to the [**Local Setup**](/docs/get-started/set-up-ibft-locally)
and [**Cloud Setup**](/docs/get-started/set-up-ibft-on-the-cloud) guides, with minor changes.

Since Hashicorp Vault is being used instead of the local file system, validator addresses should be added through the `--ibft-validator` flag:
```bash
polygon-edge genesis --ibft-validator <VALIDATOR_ADDRESS> ...
```

## Step 4 - Start the Polygon Edge client

Now that the keys are set up, and the genesis file is generated, the final step to this process would be starting the 
Polygon Edge with the `server` command.

The `server` command is used in the same manner as in the previously mentioned guides, with a minor addition - the `--secrets-config` flag:
```bash
polygon-edge server --secrets-config <PATH> ...
```

The `PATH` param is the location of the previously generated secrets manager param from step 1.