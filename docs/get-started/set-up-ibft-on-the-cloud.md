---
id: set-up-ibft-on-the-cloud
title: Cloud Setup
---

:::info This guide is for mainnet or testnet setups

The below guide will instruct you on how to set up a Polygon Edge network on a cloud provider for a production setup of your testnet or mainnet.

If you would like to setup a Polygon Edge network locally to quickly test the `polygon-edge` before doing a production-like setup, please refer to
[Local Setup](/docs/get-started/set-up-ibft-locally)
:::

## Requirements

Refer to [Installation](/docs/get-started/installation) to install Polygon Edge.

### Setting up the VM connectivity

Depending on your choice of cloud provider, you may set up connectivity and rules between the VMs using a firewall,
security groups, or access control lists.

As the only part of the `polygon-edge` that needs to be exposed to other VMs is the libp2p server, simply allowing
all communication between VMs on the default libp2p port `1478` is enough.

## Overview

![Cloud setup](/img/ibft-setup/cloud.svg)

In this guide, our goal is to establish a working `polygon-edge` blockchain network working with [IBFT consensus protocol](https://github.com/ethereum/EIPs/issues/650).
The blockchain network will consist of 4 nodes of whom all 4 are validator nodes, and as such are eligible for both proposing block, and validating blocks that came from other proposers.
Each of the 4 nodes will run on their own VM, as the idea of this guide is to give you a fully functional Polygon Edge network while keeping the validator keys private to ensure a trustless network setup.

To achieve that, we will guide you through 4 easy steps:

0. Take a look at the list of **Requirements** above
1. Generate the private keys for each of the validators, and initialize the data directory
2. Prepare the connection string for the bootnode to be put into the shared `genesis.json`
3. Create the `genesis.json` on your local machine, and send/transfer it to each of the nodes
4. Start all the nodes 

:::info Number of validators

There is no minimum to the number of nodes in a cluster, which means clusters with only 1 validator node are possible.
Keep in mind that with a _single_ node cluster, there is **no crash tolerance** and **no BFT guarantee**.

The minimum recommended number of nodes for achieving a BFT guarantee is 4 - since in a 4 node cluster, the failure of
1 node can be tolerated, with the remaining 3 functioning normally.

:::

## Step 1: Initialize data folders and generate validator keys

To get up and running with Polygon Edge, you need to initialize the data folders, on each node:


````bash
node-1> polygon-edge secrets init --data-dir data-dir
````

````bash
node-2> polygon-edge secrets init --data-dir data-dir
````

````bash
node-3> polygon-edge secrets init --data-dir data-dir
````

````bash
node-4> polygon-edge secrets init --data-dir data-dir
````

Each of these commands will print the [node ID](https://docs.libp2p.io/concepts/peer-id/). You will need that information for the next step.

:::warning Keep your data directory to yourself!

The data directories generated above, besides initializing the directories for holding the blockchain state, will also generate your validator's private keys.
**This key should be kept as a secret, as stealing it would render somebody capable of impersonating you as the validator in the network!**
:::

## Step 2: Prepare the multiaddr connection string for the bootnode

For a node to successfully establish connectivity, it must know which `bootnode` server to connect to gain
information about all the remaining nodes on the network. The `bootnode` is sometimes also known as the `rendezvous` server in p2p jargon.

`bootnode` is not a special instance of a Polygon Edge node. Every Polygon Edge node can serve as a `bootnode` and
every Polygon Edge node needs to have a set of bootnodes specified which will be contacted to provide information on how to connect with
all remaining nodes in the network.

To create the connection string for specifying the bootnode, we will need to conform
to the [multiaddr format](https://docs.libp2p.io/concepts/addressing/):
```
/ip4/<ip_address>/tcp/<port>/p2p/<node_id>
```

In this guide, we will treat the first and second nodes as the bootnodes for all other nodes. What will happen in this scenario
is that nodes that connect to the `node 1` or `node 2` will get information on how to connect to one another through the mutually
contacted bootnode. 

:::info You need to specify at least one bootnode to start a node

At least **one** bootnode is required, so other nodes in the network can discover each other. More bootnodes are recommended, as 
they provide resilience to the network in case of outages.
In this guide we will list two nodes, but this can be changed on the fly, with no impact on the validity of the `genesis.json` file.
:::

As the first part of the multiaddr connection string is the `<ip_address>`, here you will need to enter the IP address as reachable by other nodes, depending on your setup this might be a private or a public IP address, not `127.0.0.1`.

For the `<port>` we will use `1478`, since it is the default libp2p port.

And lastly, we need the `<node_id>` which we can get from the output of the previously ran command `polygon-edge secrets init --data-dir data-dir` command (which was used to generate keys and data directories for the `node 1`)

After the assembly, the multiaddr connection string to the `node 1` which we will use as the bootnode will look something like this (only the `<node_id>` which is at the end should be different):
```
/ip4/<public_or_private_ip>/tcp/1478/p2p/16Uiu2HAmJxxH1tScDX2rLGSU9exnuvZKNM9SoK3v315azp68DLPW
```
Similarly, we construct multiaddr for the second bootnode as shown below
```
/ip4/<public_or_private_ip>/tcp/1478/p2p/16Uiu2HAmS9Nq4QAaEiogE4ieJFUYsoH28magT7wSvJPpfUGBj3Hq 
```

## Step 3: Generate the genesis file with the 4 nodes as validators

This step can be run on your local machine, but you will need the public validator keys for each of the 4 validators.

Validators can safely share the `Public key (address)` as displayed below in the output to their `secrets init` commands, so that
you may securely generate the genesis.json with those validators in the initial validator set, identified by their public keys:

```
[SECRETS INIT]
Public key (address) = 0xC12bB5d97A35c6919aC77C709d55F6aa60436900
Node ID              = 16Uiu2HAmVZnsqvTwuzC9Jd4iycpdnHdyVZJZTpVC8QuRSKmZdUrf
```

Given that you have received all 4 of the validators' public keys, you can run the following command to generate the `genesis.json`

````bash
polygon-edge genesis --consensus ibft --ibft-validator=0xC12bB5d97A35c6919aC77C709d55F6aa60436900 --ibft-validator=<2nd_validator_pubkey> --ibft-validator=<3rd_validator_pubkey> --ibft-validator=<4th_validator_pubkey> --bootnode=<first_bootnode_multiaddr_connection_string_from_step_2> --bootnode <second_bootnode_multiaddr_connection_string_from_step_2> --bootnode <optionally_more_bootnodes>
````

What this command does:

* The `--ibft-validator` sets the public key of the validator that should be included in the initial validator set in the genesis block. There can be many initial validators.
* The `--bootnode` sets the address of the bootnode that will enable the nodes to find each other.
  We will use the multiaddr string of the `node 1`, as mentioned in **step 2**, although you can add as many bootnodes as you want, as displayed above.

:::info Premining account balances

You will probably want to set up your blockchain network with some addresses having "premined" balances.

To achieve this, pass as many `--premine` flags as you want per address that you want to be initialized with a certain balance
on the blockchain.

For example, if we would like to premine 1000 ETH to address `0x3956E90e632AEbBF34DEB49b71c28A83Bc029862` in our genesis block, then we would need to supply the following argument:

```
--premine=0x3956E90e632AEbBF34DEB49b71c28A83Bc029862:1000000000000000000000
```

**Note that the premined amount is in WEI, not ETH.**

:::

:::info Set the block gas limit

The default gas limit for each block is `5242880`. This value is written in the genesis file, but you may want to
increase / decrease it.

```go title="command/helper/helper.go"
const (
	GenesisFileName       = "./genesis.json"
	DefaultChainName      = "example"
	DefaultChainID        = 100
	DefaultPremineBalance = "0x3635C9ADC5DEA00000"
	DefaultConsensus      = "pow"
	GenesisGasUsed        = 458752
	GenesisGasLimit       = 5242880 // The default block gas limit
)
```

To do so, you can use the flag `--block-gas-limit` followed by the desired value as shown below :

```shell
--block-gas-limit 1000000000
```

:::

:::info Set system file descriptor limit

The default file descriptor limit ( maximum number of open files ) on some operating systems is pretty small.
If the nodes are expected to have high throughput, you might consider increasing this limit on the OS level.

For Ubuntu distro the procedure is as follows ( if you're not using Ubuntu/Debian distro, check the official docs for your OS ) :
-	Check current os limits ( open files )
```shell title="ulimit -a"
ubuntu@ubuntu:~$ ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 15391
max locked memory       (kbytes, -l) 65536
max memory size         (kbytes, -m) unlimited
open files                      (-n) 1024
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 15391
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```

- Increase open files limit
	- Localy - affects only current session:
	```shell
	ulimit -u 65535
	```
	- Globaly or per user ( add limits at the end of /etc/security/limits.conf file ) :
	```shell 
	sudo vi /etc/security/limits.conf  # we use vi, but you can use your favorite text editor
	```
	```shell title="/etc/security/limits.conf"
	# /etc/security/limits.conf
	#
	#Each line describes a limit for a user in the form:
	#
	#<domain>        <type>  <item>  <value>
	#
	#Where:
	#<domain> can be:
	#        - a user name
	#        - a group name, with @group syntax
	#        - the wildcard *, for default entry
	#        - the wildcard %, can be also used with %group syntax,
	#                 for maxlogin limit
	#        - NOTE: group and wildcard limits are not applied to root.
	#          To apply a limit to the root user, <domain> must be
	#          the literal username root.
	#
	#<type> can have the two values:
	#        - "soft" for enforcing the soft limits
	#        - "hard" for enforcing hard limits
	#
	#<item> can be one of the following:
	#        - core - limits the core file size (KB)
	#        - data - max data size (KB)
	#        - fsize - maximum filesize (KB)
	#        - memlock - max locked-in-memory address space (KB)
	#        - nofile - max number of open file descriptors
	#        - rss - max resident set size (KB)
	#        - stack - max stack size (KB)
	#        - cpu - max CPU time (MIN)
	#        - nproc - max number of processes
	#        - as - address space limit (KB)
	#        - maxlogins - max number of logins for this user

	#        - maxsyslogins - max number of logins on the system
	#        - priority - the priority to run user process with
	#        - locks - max number of file locks the user can hold
	#        - sigpending - max number of pending signals
	#        - msgqueue - max memory used by POSIX message queues (bytes)
	#        - nice - max nice priority allowed to raise to values: [-20, 19]
	#        - rtprio - max realtime priority
	#        - chroot - change root to directory (Debian-specific)
	#
	#<domain>      <type>  <item>         <value>
	#

	#*               soft    core            0
	#root            hard    core            100000
	#*               hard    rss             10000
	#@student        hard    nproc           20
	#@faculty        soft    nproc           20
	#@faculty        hard    nproc           50
	#ftp             hard    nproc           0
	#ftp             -       chroot          /ftp
	#@student        -       maxlogins       4

	*               soft    nofile          65535
	*               hard    nofile          65535

	# End of file
	```
	Optionaly, modify additional parameters, save the file and restart the system.
	After restart check file descriptor limit again.
	It should be set to the value you defined in limits.conf file.
:::

After specifying the:
1. Public keys of the validators to be included in the genesis block as the validator set
2. Bootnode multiaddr connection strings
3. Premined accounts and balances to be included in the genesis block

and generating the `genesis.json`, you should copy it over to all of the VMs in the network. Depending on your setup you may
copy/paste it, send it to the node operator, or simply SCP/FTP it over.

The structure of the genesis file is covered in the [CLI Commands](/docs/get-started/cli-commands) section.

## Step 4: Run all the clients

:::note Networking on Cloud providers

Most cloud providers don't expose the IP addresses (especially public ones) as a direct network interface on your VM but rather setup an invisible NAT proxy.


To allow the nodes to connect to each other in this case you would need to listen on the `0.0.0.0` IP address to bind on all interfaces, but you would still need to specify the IP address or DNS address which other nodes can use to connect to your instance. This is achieved either by using the `--nat` or `--dns` argument where you can specify your external IP or DNS address respectively.

#### Example

The associated IP address that you wish to listen on is `192.0.2.1`, but it is not directly bound to any of your network interfaces.

To allow the nodes to connect you would pass the following parameters:

`polygon-edge ... --libp2p 0.0.0.0:10001 --nat 192.0.2.1`

Or, if you wish to specify a DNS address `dns/example.io`, pass the following parameters:

`polygon-edge ... --libp2p 0.0.0.0:10001 --dns dns/example.io`

This would make your node listen on all interfaces, but also make it aware that the clients are connecting to it through the specified `--nat` or `--dns` address.

:::

To run the **first** client:


````bash
node-1> polygon-edge server --data-dir ./data-dir --chain genesis.json  --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

To run the **second** client:

````bash
node-2> polygon-edge server --data-dir ./data-dir --chain genesis.json --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

To run the **third** client:

````bash
node-3> polygon-edge server --data-dir ./data-dir --chain genesis.json --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

To run the **fourth** client:

````bash
node-4> polygon-edge server --data-dir ./data-dir --chain genesis.json --libp2p 0.0.0.0:1478 --nat <public_or_private_ip> --seal
````

After running the previous commands, you have set up a 4 node Polygon Edge network, capable of sealing blocks and recovering
from node failure.

:::info Start the client using config file

Instead of specifying all configuration parameters as CLI arguments, the Client can also be started using a config file by executing the following command: 

````bash 
polygon-edge server --config <config_file_path>
````
Example :

````bash
polygon-edge server --config ./test/config-node1.json
````
Currently, we only support `json` based configuration file, sample config file can be found [here](/docs/configuration/sample-config)

:::

:::info Steps to run a non-validator node 

A Non-validator will always sync the latest blocks received from the validator node, you can start a non-validator node by running the following command.

````bash 
polygon-edge server --data-dir <directory_path> --chain <genesis_filename>  --libp2p <IPAddress:PortNo> --nat <public_or_private_ip>
````
For example, you can add **fifth** Non-validator client by executing the following command :

````bash
polygon-edge server --data-dir ./data-dir --chain genesis.json --libp2p 0.0.0.0:1478 --nat<public_or_private_ip>
````
:::

:::info Specify the price limit
A Polygon Edge node can be started with a set **price limit** for incoming transactions.

The unit for the price limit is `wei`.

Setting a price limit means that any transaction processed by the current node will need to have a gas price **higher**
than the set price limit, otherwise it will not be included into a block.

Having the majority of nodes respect a certain price limit enforces the rule that transactions in the network
cannot be below a certain price threshold.

The default value for the price limit is `0`, meaning it is not enforced at all by default.

Example of using the `--price-limit` flag:
````bash
polygon-edge server --price-limit 100000 ...
````

It is worth noting that price limits **are enforced only on non-local transactions**, meaning
that the price limit does not apply to transactions added locally on the node.
:::