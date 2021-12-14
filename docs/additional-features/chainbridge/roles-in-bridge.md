---
id: roles-in-bridge
title: Roles in Bridge
---

## Admin Role

Certain actions can only be performed by the admin role account. By default, the deployer of the Bridge contract has the `admin` role. To grant the admin role to another account or to remove it, you can do the following:

```bash
# Grant admin role
$ cb-sol-cli admin add-admin \
  --url [JSON_RPC_URL] \
  --privateKey [PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --addmin "[NEW_ACCOUNT_ADDRESS]"

# Revoke admin role
$ cb-sol-cli admin remove-admin \
  --url [JSON_RPC_URL] \
  --privateKey [PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --addmin "[NEW_ACCOUNT_ADDRESS]"
```

The operations which are allowed by the `admin` account are as below.

### Set Resource

```bash
# Register new resource
$ cb-sol-cli bridge register-resource \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --resourceId "[RESOURCE_ID]" \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --handler "[HANDLER_CONTRACT_ADDRESS]" \
  --targetContract "[TARGET_CONTRACT_ADDRESS]"
```

### Make contract burnable/mintable

```bash
# Let contract burnable/mintable
$ cb-sol-cli bridge set-burn \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --handler "[HANDLER_CONTRACT_ADDRESS]" \
  --tokenContract "[TARGET_CONTRACT_ADDRESS]"
```

### Cancel proposal

Cancel proposal for execution

```bash
# Cancel ongoing proposal
$ cb-sol-cli bridge cancel-proposal \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --resourceId "[RESOURCE_ID]" \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --chainId "[CHAIN_ID_OF_SOURCE_CHAIN]" \
  --depositNonce "[NONCE]"
```

### Pause/Unpause

Pause deposits, proposal creation, voting, and deposit executions temporally.

```bash
# Pause
$ cb-sol-cli admin pause \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]"

# Unpause
$ cb-sol-cli admin unpause \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]"
```

### Change Fee

Change the fee which will be paid to Bridge Contract

```bash
# Change fee for execution
$ cb-sol-cli admin set-fee \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --fee [FEE_IN_WEI]
```

### Add/Remove a relayer

Add an account as a new relayer or remove an account from relayers

```bash
# Add relayer
$ cb-sol-cli admin add-relayer \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --relayer "[NEW_RELAYER_ADDRESS]"
  
# Remove relayer
$ cb-sol-cli admin remove-relayer \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --relayer "[RELAYER_ADDRESS]"
```

### Change relayer threshold

Change the number of votes required for a proposal execution

```bash
# Remove relayer
$ cb-sol-cli admin set-threshold \
  --url [JSON_RPC_URL] \
  --privateKey [ADMIN_ACCOUNT_PRIVATE_KEY] \
  --bridge "[BRIDGE_CONTRACT_ADDRESS]" \
  --threshold [THRESHOLD]
```
