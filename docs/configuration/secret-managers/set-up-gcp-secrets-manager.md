---
id: set-up-gcp-secrets-manager
title: Set up GCP Secrets Manager
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

This article details the necessary steps to get the Polygon Edge up and running with [GCP Secret Manager](https://cloud.google.com/secret-manager).

:::info previous guides
It is **highly recommended** that before going through this article, articles on [**Local Setup**](/docs/get-started/set-up-ibft-locally)
and [**Cloud Setup**](/docs/get-started/set-up-ibft-on-the-cloud) are read.
:::


## Prerequisites
### GCP Billing Account
In order to utilize GCP Secrets Manager, the user has to have [Billing Account](https://console.cloud.google.com/) enabled on the GCP portal.
New Google accounts on GCP platform are provided with some funds to get started, as a king of free trial.
More info [GCP docs](https://cloud.google.com/free)

### Secrets Manager API
The user will need to enable the GCP Secrets Manager API, before he can use it.
This can be done via [Secrets Manager API portal](https://console.cloud.google.com/apis/library/secretmanager.googleapis.com).
More info: [Configuring Secret Manger](https://cloud.google.com/secret-manager/docs/configuring-secret-manager)

### GCP Credentials
Finally, the user needs to generate new credentials that will be used for authentication.
This can be done by following the instructions posted [here](https://cloud.google.com/secret-manager/docs/reference/libraries).   
The generated json file containing credentials, should be transferred to each node that needs to utilize GCP Secrets Manager.

Required information before continuing:
* **Project ID** (the project id defined on GCP platform)
* **Credentials File Location** (the path to the json file containing the credentials)

## Step 1 - Generate the secrets manager configuration

In order for the Polygon Edge to be able to seamlessly communicate with the GCP SM, it needs to parse an already
generated config file, which contains all the necessary information for secret storage on GCP SM.

To generate the configuration, run the following command:

```bash
polygon-edge secrets generate --type gcp-ssm --dir <PATH> --name <NODE_NAME> --extra project-id=<PROJECT_ID>,gcp-ssm-cred=<GCP_CREDS_FILE>
```

Parameters present:
* `PATH` is the path to which the configuration file should be exported to. Default `./secretsManagerConfig.json`
* `NODE_NAME` is the name of the current node for which the GCP SM configuration is being set up as. It can be an arbitrary value. Default `polygon-edge-node`
* `PROJECT_ID` is the ID of the project the user has defined in GCP console during account setup and Secrets Manager API activation.
* `GCP_CREDS_FILE` is the path to the json file containing credentials which will allow read/write access to the Secrets Manager.

:::caution Node names
Be careful when specifying node names.

The Polygon Edge uses the specified node name to keep track of the secrets it generates and uses on the GCP SM.
Specifying an existing node name can have consequences of failing to write secret to GCP SM.

Secrets are stored on the following base path: `projects/PROJECT_ID/NODE_NAME`
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

Since GCP SM is being used instead of the local file system, validator addresses should be added through the `--ibft-validator` flag:
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