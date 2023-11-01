# @superchain-testnet-tools/indexed-chains

Source of truth for the chains that are indexed by @superchain-testnet-tools/indexer

`indexer` uses this to decide which chains to index
`frontend` uses this to know which chains are indexed by the `indexer`

Whether a chain is indexed or not depends on whether I can get a reasonable RPC endpoint for it

Reason it's in a separate package instead of in the `indexer` package is because the way ponder builds (`ponder.config.ts` is not available in the final build) 