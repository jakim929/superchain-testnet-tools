import {
  baseSepoliaOpStackChain,
  lyraSepoliaOpStackChain,
  modeSepoliaOpStackChain,
  optimismSepoliaOpStackChain,
  orderlySepoliaOpStackChain,
  zoraSepoliaOpStackChain,
} from '@superchain-testnet-tools/chains'

export const indexedOpStackChains = [
  optimismSepoliaOpStackChain,
  baseSepoliaOpStackChain,
  orderlySepoliaOpStackChain,
  zoraSepoliaOpStackChain,
  // lyraSepoliaOpStackChain,
  // modeSepoliaOpStackChain,
]

export type IndexedOpStackChains = typeof indexedOpStackChains
export type IndexedOpStackChain = IndexedOpStackChains[number]
