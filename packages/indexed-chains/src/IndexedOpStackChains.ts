import {
  baseSepoliaOpStackChain,
  modeSepoliaOpStackChain,
  optimismSepoliaOpStackChain,
  zoraSepoliaOpStackChain,
} from '@superchain-testnet-tools/chains'

export const indexedOpStackChains = [
  optimismSepoliaOpStackChain,
  baseSepoliaOpStackChain,
  zoraSepoliaOpStackChain,
  modeSepoliaOpStackChain,
]

export type IndexedOpStackChains = typeof indexedOpStackChains
export type IndexedOpStackChain = IndexedOpStackChains[number]
