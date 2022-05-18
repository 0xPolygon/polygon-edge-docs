---
id: sample-config
title: Server Config File
---
# Server configuration file
Starting the server with various configuration options can be done using a configuration file instead of using just flags.  
The command used to start the server with a config file: `polygon-edge server --config <config_file_name>`

## Export config file with default configuration
The configuration with default settings for the Polygon Edge server can be exported into a config file in either `yaml` or `json` file format.
This file can be used as a template for running the server using a configuration file.

### YAML
To generate the config file in `yaml` format:
```bash
polygon-edge server export --type yaml
```
or just 
```bash
polygon-edge server export
```
the config file named `default-config.yaml` will be created in the same directory that this command has been run from.  

File example:
```yaml
chain_config: ./genesis.json
secrets_config: ""
data_dir: ""
block_gas_target: "0x0"
grpc_addr: ""
jsonrpc_addr: ""
telemetry:
  prometheus_addr: ""
network:
  no_discover: false
  libp2p_addr: 127.0.0.1:1478
  nat_addr: ""
  dns_addr: ""
  max_peers: -1
  max_outbound_peers: -1
  max_inbound_peers: -1
seal: true
tx_pool:
  price_limit: 0
  max_slots: 4096
log_level: INFO
restore_file: ""
block_time_s: 2
headers:
  access_control_allow_origins:
    - '*'
log_to: ""
```

### JSON
To generate the config file in `json` format:
```bash
polygon-edge server export --type json
```
the config file named `default-config.json` will be created in the same directory that this command has been run from.

File example:

```json
{
  "chain_config": "./genesis.json",
  "secrets_config": "",
  "data_dir": "",
  "block_gas_target": "0x0",
  "grpc_addr": "",
  "jsonrpc_addr": "",
  "telemetry": {
    "prometheus_addr": ""
  },
  "network": {
    "no_discover": false,
    "libp2p_addr": "127.0.0.1:1478",
    "nat_addr": "",
    "dns_addr": "",
    "max_peers": -1,
    "max_outbound_peers": -1,
    "max_inbound_peers": -1
  },
  "seal": true,
  "tx_pool": {
    "price_limit": 0,
    "max_slots": 4096
  },
  "log_level": "INFO",
  "restore_file": "",
  "block_time_s": 2,
  "headers": {
    "access_control_allow_origins": [
      "*"
    ]
  },
  "log_to": ""
}
```

Checkout [CLI Commands](/docs/get-started/cli-commands) section to get information on how to use these parameters.
