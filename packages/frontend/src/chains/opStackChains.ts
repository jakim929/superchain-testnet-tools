import { baseGoerliOpStackChain } from '@/chains/baseGoerli'
import { baseSepoliaOpStackChain } from '@/chains/baseSepolia'
import { optimismGoerliOpStackChain } from '@/chains/optimismGoerli'
import { optimismSepoliaOpStackChain } from '@/chains/optimismSepolia'
import { pgnSepolia, pgnSepoliaOpStackChain } from '@/chains/pgnSepolia'
import {
  baseGoerli,
  baseSepolia,
  optimismGoerli,
  optimismSepolia,
  zoraTestnet,
} from 'viem/chains'

// TODO use the opStackChain config as source of truth
export const opStackChainByL2ChainId = {
  [baseGoerli.id]: baseGoerliOpStackChain,
  [baseSepolia.id]: baseSepoliaOpStackChain,
  [optimismSepolia.id]: optimismSepoliaOpStackChain,
  [optimismGoerli.id]: optimismGoerliOpStackChain,
  [pgnSepolia.id]: pgnSepoliaOpStackChain,
  [zoraTestnet.id]: pgnSepoliaOpStackChain,
} as const

export const opStackChains = Object.values(opStackChainByL2ChainId)
