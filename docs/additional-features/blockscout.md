---
id: blockscout 
title: Blockscout
---

## Overview
This guide goes into details on how to compile and deploy Blockscout instance to work with Polygon-Edge.
Blockscout has its own [documentation](https://docs.blockscout.com/for-developers/manual-deployment), but this guide focuses on simple but detailed step-by-step instructions on how to setup Blockscout instance.

## Environment
* Operating System: Ubuntu Server 20.04 LTS [download link](https://releases.ubuntu.com/20.04/) with sudo permissions
* Server Hardware:  2CPU / 4GB RAM / 50GB HDD (LVM)
* Database Server:  Dedicated server with 2 CPU / 4GB RAM / 30GB SSD / PostresSQL 13.4

### DB Server
The requirement for following this guide is to have a database server ready, database and db user configured.
This guide will not go into details on how to deploy and configure PosgreSQL server.
There are plenty of guides on now to do this, for example [DigitalOcean Guide](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)

:::info DISCLAMER
This guide is meant only to help you to get Blockscout up and running on a single instance which is not ideal production setup.   
For production, you'll probably want to introduce reverse proxy, load balancer, scalability options, etc. into the architecture.
:::

# Blockscout Deployment Procedure

## Part 1 - install dependancies
Before we start we need to make sure we have all the binaries installed that the blockscout is dependent on.

### Update & upgrade system
```bash
sudo apt update && sudo apt -y upgrade
```

### Install erlang and its dependancies from default packages
```bash
sudo apt -y install erlang
```

### Add erlang repos
```bash
# go to your home dir
cd ~
# download deb
wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb
# download key
wget https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc
# install repo
sudo dpkg -i erlang-solutions_2.0_all.deb
# install key
sudo apt-key add erlang_solutions.asc
# remove deb
rm erlang-solutions_2.0_all.deb
# remove key
rm erlang_solutions.asc
```

### Add NodeJS repo
```bash
sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```

### Install Rust
```bash
sudo curl https://sh.rustup.rs -sSf | sh -s -- -y
```

### Install specific versions of Erlang and Elixir
```bash
sudo apt -y install esl-erlang=1:24.* elixir=1.12.*
```

### Install NodeJS
```bash
sudo apt -y install nodejs
```

### Install Cargo
```bash
sudo apt -y install cargo
```

### Install other dependancies
```bash
sudo apt -y install automake libtool inotify-tools gcc libgmp-dev make g++ git
```

### Optionaly install postgresql client to check your db connection
```bash
sudo apt -y postgresql-client
```

## Part 2 - set environment variables
We need to set the environment variables, before we begin with Blockscout compilation.
In this guide we'll set only the basic minimum to get it working.
Full list of variables that can be set you can find [here](https://docs.blockscout.com/for-developers/information-and-settings/env-variables)

### Set env vars
```bash
# example:  ETHEREUM_JSONRPC_HTTP_URL=https://rpc.poa.psdk.io:8545
export  ETHEREUM_JSONRPC_HTTP_URL=<your polygon-edge json-rpc endpoint>
# example: ETHEREUM_JSONRPC_TRACE_URL=https://rpc.poa.psdk.io:8545
export ETHEREUM_JSONRPC_TRACE_URL=<your polygon-edge json-rpc endpoint>
# example: ETHEREUM_JSONRPC_WS_URL=wss://rpc.poa.psdk.io:8545/ws
export ETHEREUM_JSONRPC_WS_URL=<your polygon-edge websocket endpoint>
# used for automaticaly restarting the service if it crashes
export HEART_COMMAND="systemctl start explorer.service"
# postgresql connection example:  DATABASE_URL=postgresql://blockscout:Passw0Rd@db.instance.local:5432/blockscout
export DATABASE_URL=postgresql://<db_user>:<db_pass>@<db_host>:<db_port>/<db_name>
# secret key base as per docs https://docs.blockscout.com/for-developers/manual-deployment ( Step 4 )
export SECRET_KEY_BASE=VTIB3uHDNbvrY0+60ZWgUoUBKDn9ppLR8MI4CpRz4/qLyEFs54ktJfaNT6Z221No

# we set these env vars to test the db connection
export PGPASSWORD=Passw0Rd
export PGUSER=blockscout
export PGHOST=db.instance.local
```

Now test your DB connection with provided parameters.
Since you've provided PG env vars, you should be able to connect to the database only by running:
```bash
psql
```

If the database is configured correctly, you should see a psql prompt:
```bash
psql (12.9 (Ubuntu 12.9-0ubuntu0.20.04.1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

blockscout=>
```

Otherwise you might see an error like this:
```bash
psql: error: FATAL:  password authentication failed for user "blockscout"
FATAL:  password authentication failed for user "blockscout"
```
If this is the case [these docs](https://ubuntu.com/server/docs/databases-postgresql) might help you.

:::info DB Connection
Make sure you've sorted out all db connection issues before proceeding to the next part.
You'll need to provide superuser privileges to blockscout user.
:::
```bash
postgres@ubuntu:~$ createuser --interactive
Enter name of role to add: blockscout
Shall the new role be a superuser? (y/n) y
```

## Part 3 - clone and compile Blockscout
Now we finaly get to start the Blockscout installation.

### Clone Blockscout repo
```bash
cd ~
git clone https://github.com/poanetwork/blockscout.git
```

### Compile 
Cd into clone directory and start compiling

```bash
cd blockcout
mix local.hex --force
mix do deps.get, local.rebar --force, deps.compile, compile
```

### Migrate databases
:::info 
This part will fail if you didn't setup your DB connection properly, you didn't provide or you've defined wrong parameters at DATABASE_URL environment variable.
The database user needs to have superuser privileges.
:::
```bash
mix do ecto.create, ecto.migrate
```

### Install npm dependancies and compile frontend assets
You need to change directory to the folder which contains frontend assets.

```bash
cd apps/block_scout_web/assets
sudo npm install
sudo node_modules/webpack/bin/webpack.js --mode production
```

:::info Be patient
Compilation of these assets can take a few minutes, and it will display no output.
It can look like the process is stuck, but just be patient.
When compile process is finished, it should output something like: `webpack 5.69.1 compiled with 3 warnings in 104942 ms`
:::

### Build static assets
For this step you need to return to the root of your Blockscout clone folder.
```bash
cd ~/blockscout
sudo mix phx.digest
```

### Generate self-signed certificates
```bash
cd apps/block_scout_web
mix phx.gen.cert blockscout blockscout.local
```

## Part 4 - create and run Blockscout service
In this part we need to setup a system service as we want Blockscout to run in the backround and persist after system reboot.

### Create service file
```bash
sudo touch /etc/systemd/system/explorer.service
```

### Edit service file
Use your favorite linux text editor to edit this file and configure the service.
```bash
sudo vi /etc/systemd/system/explorer.service
```
The contents of the explorer.service file should look like this:
```
[Unit]
Description=Blockscout Server
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=root
StandardOutput=syslog
StandardError=syslog
WorkingDirectory=/usr/local/blockscout
ExecStart=/usr/bin/mix phx.server
EnvironmentFile=/usr/local/blockscout/env_vars.env

[Install]
WantedBy=multi-user.target
```

### Enable starting service on system boot
```bash
sudo systemctl daemon-reload
sudo systemctl enable explorer.service
```

### Move your Blockscout clone folder to system wide location
Blockscout service needs to have access to the folder you've cloned from Blockscout repo and compiled all the assets.
```bash
sudo mv ~/blockscout /usr/local
```

### Create env vars file which will be used by Blockscout service
:::info
Use the same environment variables as you've set in Part 2.
:::

```bash
sudo touch /usr/local/blockscout/env_vars.env
# use your favorite text editor
sudo vi /usr/local/blockscout/env_vars.env

# env_vars.env file should hold these values ( adjusted for your environment )
ETHEREUM_JSONRPC_HTTP_URL=https://rpc.poa.psdk.io:8545
ETHEREUM_JSONRPC_TRACE_URL=https://rpc.poa.psdk.io:8545
DATABASE_URL=postgresql://blockscout:Passw0Rd@db.instance.local:5432/blockscout
SECRET_KEY_BASE=VTIB3uHDNbvrY0+60ZWgUoUBKDn9ppLR8MI4CpRz4/qLyEFs54ktJfaNT6Z221No
HEART_COMMAND="systemctl start explorer.service"
```
Save the file and exit.

### Finaly start Blockscout service
```bash
sudo systemctl start explorer.service
```

## Part 5 - test out the functionality of your Blockscout instance
Now all thats left to do is to check if Blockscout service is running.
Check service status with:
```bash
sudo systemctl status explorer.service
```

To check service output:
```bash
sudo journalctl -u explorer.service
```

You can check if there are some new listening ports:
```bash
# if netstat is not installed
sudo apt install net-tools
sudo netstat -tulpn
```

You should get a list of listening ports and on the list there should be something like this:
```
tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN      28142/postgres
tcp        0      0 0.0.0.0:4000            0.0.0.0:*               LISTEN      42148/beam.smp
tcp        0      0 0.0.0.0:4001            0.0.0.0:*               LISTEN      42148/beam.smp
```

Blockscout web service runs by default on ports `4000`(http) and `4001`(https).
If everythig is ok, you should be able to access the Blockscout web portal with `http://<host_ip>:4000` or `https://<host_ip>:4001`



## Final thoughts
We've just deployed a single Blockscout instance, which works fine, but for production you should consider placing this instance behind a reverse proxy like Nginx.
You sould also think about database and instance scalability, depending on your use case.

You should definitely checkout the official [Blockscout documentation](https://docs.blockscout.com/) as there a lot of customisation options.