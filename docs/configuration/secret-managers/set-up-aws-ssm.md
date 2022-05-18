---
id: set-up-aws-ssm
title: Set up AWS SSM (Systems Manager)
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

This article details the necessary steps to get the Polygon Edge up and running with
[AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html).

:::info previous guides
It is **highly recommended** that before going through this article, articles on [**Local Setup**](/docs/get-started/set-up-ibft-locally)
and [**Cloud Setup**](/docs/get-started/set-up-ibft-on-the-cloud) are read.
:::


## Prerequisites
### IAM Policy
User needs to create an IAM Policy that allows read/write operations for AWS Systems Manager Parameter Store.
After successfully creating IAM Policy, the user needs to attach it to the EC2 instance that is running the Polygon Edge server.
The IAM Policy should look something like this:
```json
{
  "Version": "2012-10-17",
  "Statement" : [
    {
      "Effect" : "Allow",
      "Action" : [
        "ssm:PutParameter",
        "ssm:DeleteParameter",
        "ssm:GetParameter"
      ],
      "Resource" : [
        "arn:aws:ssm:<aws_region>:<aws_account_id>:parameter<ssm-parameter-path>*"
      ]
    }
  ]
}
```
More information on AWS SSM IAM Roles you can find in the [AWS docs](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-instance-profile.html).

Required information before continuing:
* **Region** (the region in which Systems Manager and nodes reside)
* **Parameter Path** (arbitrary path that the secret will be placed in, for example `/polygon-edge/nodes`)

## Step 1 - Generate the secrets manager configuration

In order for the Polygon Edge to be able to seamlessly communicate with the AWS SSM, it needs to parse an already
generated config file, which contains all the necessary information for secret storage on AWS SSM.

To generate the configuration, run the following command:

```bash
polygon-edge secrets generate --type aws-ssm --dir <PATH> --name <NODE_NAME> --extra region=<REGION>,ssm-parameter-path=<SSM_PARAM_PATH>
```

Parameters present:
* `PATH` is the path to which the configuration file should be exported to. Default `./secretsManagerConfig.json`
* `NODE_NAME` is the name of the current node for which the AWS SSM configuration is being set up as. It can be an arbitrary value. Default `polygon-edge-node`
* `REGION` is the region in which the AWS SSM resides. This has to be the same region as the node utilizing AWS SSM.
* `SSM_PARAM_PATH` is the name of the path that the secret will be stored in. For example if `--name node1` and `ssm-parameter-path=/polygon-edge/nodes`
are specified, the secret will be stored as `/polygon-edge/nodes/node1/<secret_name>`

:::caution Node names
Be careful when specifying node names.

The Polygon Edge uses the specified node name to keep track of the secrets it generates and uses on the AWS SSM.
Specifying an existing node name can have consequences of failing to write secret to AWS SSM.

Secrets are stored on the following base path: `SSM_PARAM_PATH/NODE_NAME`
:::

## Step 2 - Initialize secret keys using the configuration

Now that the configuration file is present, we can initialize the required secret keys with the configuration
file set up in step 1, using the `--config`:

```bash
polygon-edge secrets init --config <PATH>
```

The `PATH` param is the location of the previously generated secrets manager param from step 1.

:::info IAM Policy
This step will fail if IAM Policy that allows read/write operations is not configured correctly and/or not attached to the EC2 instance running this command. 
:::

## Step 3 - Generate the genesis file

The genesis file should be generated in a similar manner to the [**Local Setup**](/docs/get-started/set-up-ibft-locally)
and [**Cloud Setup**](/docs/get-started/set-up-ibft-on-the-cloud) guides, with minor changes.

Since AWS SSM is being used instead of the local file system, validator addresses should be added through the `--ibft-validator` flag:
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