import { baseGoerliOpStackChain } from '@/chains/baseGoerli'
import { baseSepoliaOpStackChain } from '@/chains/baseSepolia'
import { optimismGoerliOpStackChain } from '@/chains/optimismGoerli'
import { optimismSepoliaOpStackChain } from '@/chains/optimismSepolia'
import { pgnSepolia, pgnSepoliaOpStackChain } from '@/chains/pgnSepolia'
import { zoraSepolia, zoraSepoliaOpStackChain } from '@/chains/zoraSepolia'
import {
  baseGoerli,
  baseSepolia,
  optimismGoerli,
  optimismSepolia,
} from 'viem/chains'

// TODO use the opStackChain config as source of truth
export const opStackChainByL2ChainId = {
  [baseGoerli.id]: baseGoerliOpStackChain,
  [baseSepolia.id]: baseSepoliaOpStackChain,
  [optimismSepolia.id]: optimismSepoliaOpStackChain,
  [optimismGoerli.id]: optimismGoerliOpStackChain,
  [pgnSepolia.id]: pgnSepoliaOpStackChain,
  [zoraSepolia.id]: zoraSepoliaOpStackChain,
} as const

export const opStackChains = Object.values(opStackChainByL2ChainId)
