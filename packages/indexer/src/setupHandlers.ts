import { indexedOpStackChains } from '@superchain-testnet-tools/indexed-chains'
import { setupEventHandlers } from '@/src/handlers'

indexedOpStackChains.map((indexedOpStackChain) => {
  console.log(
    'registering event handlers for',
    indexedOpStackChain.l2Chain.network,
  )
  setupEventHandlers(indexedOpStackChain)
})
