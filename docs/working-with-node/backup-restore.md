---
id: backup-restore
title: Backup/restore node instance
---

## Overview

This guide goes into detail on how to back up and restore a Polygon Edge node instance.
It covers the base folders and what they contain, as well as which files are critical for performing a successful backup and restore.

## Base folders

Polygon Edge leverages LevelDB as its storage engine.
When starting a Polygon Edge node, the following sub-folders are created in the specified working directory:
* **blockchain** - Stores the blockchain data
* **trie** - Stores the Merkle tries (world state data)
* **keystore** - Stores private keys for the client. This includes the libp2p private key and the sealing/validator private key
* **consensus** - Stores any consensus information that the client might need while working. For now, it stores the node's *private validator key*

It is critical for these folders to be preserved in order for the Polygon Edge instance to run smoothly.

## Create backup from a running node and restore for new node

This section guides you through creating archive data of the blockchain in a running node and restoring it in another instance.

### Backup

`backup` command fetches blocks from a running node by gRPC and generates an archive file. If `--from` and `--to` are not given in the command, this command will fetch blocks from genesis to latest.

```bash
$ polygon-edge backup --grpc-address 127.0.0.1:9632 --out backup.dat [--from 0x0] [--to 0x100]
```

### Restore

A server imports blocks from an archive at the start when starting with `--restore` flag. Please make sure that there is a key for new node. To find out more about importing or generating keys, visit the [Secret Managers section](/docs/configuration/secret-managers/set-up-aws-ssm).

```bash
$ polygon-edge server --restore archive.dat
```

## Back up/Restore Whole data

This section guides you through backup the data including state data and key and restoring into the new instance.

### Step 1: Stop the running client

Since the Polygon Edge uses **LevelDB** for data storage, the node needs to be stopped for the duration of the backup, 
as **LevelDB** doesn't allow for concurrent access to its database files.

Additionally, the Polygon Edge also does data flushing on close.

The first step involves stopping the running client (either through a service manager or some other mechanism that sends a SIGINT signal to the process), 
so it can trigger 2 events while gracefully shutting down:
* Running data flush to disk
* Release of the DB files lock by LevelDB

### Step 2: Backup the directory

Now that the client is not running, the data directory can be backed up to another medium. 
Keep in mind that the files with a `.key` extension contain the private key data that can be used to impersonate the current node,
and they should never be shared with a third/unknown party.

:::info
Please back up and restore the generated `genesis` file manually, so the restored node is fully operational.
::: 

## Restore

### Step 1: Stop the running client

If any instance of the Polygon Edge is running, it needs to be stopped in order for step 2 to be successful.

### Step 2: Copy the backed up data directory to the desired folder

Once the client is not running, the data directory which was previously backed up can be copied over to the desired folder.
Additionally, restore the previously copied `genesis` file.

### Step 3: Run the Polygon Edge client while specifying the correct data directory 

In order for the Polygon Edge to use the restored data directory, at launch, the user needs to specify the path to the 
data directory. Please consult the [CLI Commands](/docs/get-started/cli-commands) section on information regarding the `data-dir` flag.
