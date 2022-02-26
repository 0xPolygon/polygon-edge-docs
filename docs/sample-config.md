---
id: sample-config
title: Server Config File
---

Following is the sample format for configuration file. It's written in TypeScript to express the properties types (`string`, `number`, `boolean`), from it you could derive your configuration. It's worth mentioning that the `PartialDeep` type from `type-fest` is used to express that all properties are optional.

```typescript
import { PartialDeep } from 'type-fest';

type ServerConfig = PartialDeep<{
  chain_config: string; // <genesis_file_path>
  secrets_config: string; // <secrets_file_path>
  data_dir: string; // <data_directory_path>
  block_gas_target: string; // <block_gas_limit>
  grpc_addr: string; // <grpc_listener_address>
  jsonrpc_addr: string; // <json_rpc_listener_address>
  telemetry: {
    prometheus_addr: string; // <prometheus_listener_address>
  };
  network: {
    no_discover: boolean; // <enable/disable_discovery>,
    libp2p_addr: string; // <libp2p_server_address>,
    nat_addr: string; // <nat_address>,
    dns_addr: string; // <dns_address>,
    max_peers: number; // <maximum_allowded_peers>,
    max_inbound_peers: number; // <maximum_allowded_inbound_peers>,
    max_outbound_peers: number; // <maximum_allowded_outbound_peers>
  };
  txpool: {
    locals: string; // <local_account_addresses>
    no_locals: boolean; // <enable/disable_locals>
    price_limit: number; // <minimum_gas_price_limit>
    max_slots: number; // <maximum_txpool_slots>
  };
  seal: boolean; // <enable/disable_block_sealing>
  log_level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'DPANIC' | 'PANIC' | 'FATAL'; // <log_level>
  dev_mode: boolean; // <enable/disable_dev_mode>
  dev_internal: number; // <dev_notification_interval>
  join_addr: string; // <peer_address>
  block_time_s: number; // <block_time_seconds>
}>
```
