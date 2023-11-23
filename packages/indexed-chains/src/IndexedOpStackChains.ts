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
  modeSepoliaOpStackChain,
  lyraSepoliaOpStackChain,
]

export type IndexedOpStackChains = typeof indexedOpStackChains
export type IndexedOpStackChain = IndexedOpStackChains[number]
