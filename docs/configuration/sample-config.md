---
id: sample-config
title: Server Config File
---

Following is the sample format for configuration file: 

```json
{
	"chain_config":<genesis_file_path>, 
	"secrets_config":<secrets_file_path>,
	"data_dir":<data_directory_path>,
	"block_gas_target":<block_gas_limit>,
	"grpc_addr":<grpc_listener_address>,
	"jsonrpc_addr":<json_rpc_listener_address>,
	"telemetry":{
		"prometheus_addr":<prometheus_listener_address>
	},
	"network":{
		"no_discover":<enable/disable_discovery>,
		"libp2p_addr":<libp2p_server_address>,
		"nat_addr":<nat_address>,
		"dns_addr":<dns_address>,
		"max_peers":<maximum_allowded_peers>,
		"max_inbound_peers":<maximum_allowded_inbound_peers>,
		"max_outbound_peers":<maximum_allowded_outbound_peers>
	},
	"txpool":{
		"price_limit":<minimum_gas_price_limit>,
		"max_slots":<maximum_txpool_slots>
	},
	"headers": {
		"access_control_allow_origins": <allowed_origins>
	},
	"seal":<enable/disable_block_sealing>, 
	"log_level":<log_level>,
	"block_time":<block_time_in_second>,
	"restore_file":<backup_file_path>
}
```
