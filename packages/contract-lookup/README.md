# @superchain-testnet-tools/contract-lookup

## Contract Lookup Service

This service returns the metadata (mostly ABI) for a contract on an OP Stack chain. It looks the ABI up on Blockscout or Etherscan, and caches (not yet) it in a postgres db.

### API server

currently only supports
```
/contract-metadata/:chainId/:address
```

### API worker

Set up using `bullmq` but not being used yet