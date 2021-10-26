---
id: howto-backup-restore
title: How to back up / restore
---

## Overview

This guide goes into detail on how to back up and restore a Polygon SDK node instance.
It covers the base folders and what they contain, as well as which files are critical for performing a successful backup and restore.

## Base folders

Polygon SDK leverages LevelDB as its storage engine.
When starting a Polygon SDK node, the following sub-folders are created in the specified working directory:
* **blockchain** - Stores the blockchain data
* **trie** - Stores the Merkle tries (world state data)
* **keystore** - Stores private keys for the client. This includes the libp2p private key, and the sealing / validator private key
* **consensus** - Stores any consensus information that the client might need while working. For now, it stores the node's *private validator key*

It is critical for these folders to be preserved in order for the Polygon SDK instance to run smoothly.

## Back up

### Step 1: Stop the running client

Since the Polygon SDK uses **LevelDB** for data storage, it is currently not possible to set up a `cron` job or use `rsync` in order
to do automatic backups of the data directory while the client is running, as **LevelDB** doesn't allow for concurrent access to its database files.

Additionally, the Polygon SDK also does data flushing on close.

The first step involves stopping the running client (CTRL-C to gracefully shut it down), so it can trigger 2 events:
* Running data flush to disk
* Release of the DB files lock by LevelDB

### Step 2: Backup the directory

Now that the client is not running, the data directory can be backed up to another medium. 
Keep in mind that the files with a `.key` extension contain the private key data that can be used to impersonate the current node,
and they should never be shared with a third / unknown party.

:::info
Please note that clients running the IBFT consensus mechanism need to back up the generated `genesis` file as well, in order for their
restore process to be successful.
::: 

## Restore

### Step 1: Stop the running client

If any instance of the Polygon SDK is running, it needs to be stopped in order for step 2 to be successful.

### Step 2: Copy the backed up data directory to the desired folder

Once the client is not running, the data directory which was previously backed up can be copied over to the desired folder.
Additionally, restore the previously copied `genesis` file.

### Step 3: Run the Polygon SDK client while specifying the correct data directory 

In order for the Polygon SDK to use the restored data directory, at launch, the user needs to specify the path to the 
data directory. Please consult the [CLI Commands](/docs/cli-commands) section on information regarding the `data-dir` flag.

## Future improvements

The process of backing up and restoring data directories is cumbersome when the node needs to be turned off in order to perform it.

The Polygon SDK team aims to mitigate this inconvenience by introducing a few new commands, namely `export <filename> [start-block] [end-block]`
for backing up the current client data, as well as `import <filename>` for restoring previously backed up data.

The commands will be implemented as operator commands through the gRPC layer, and will not require the node operator to turn off the client.