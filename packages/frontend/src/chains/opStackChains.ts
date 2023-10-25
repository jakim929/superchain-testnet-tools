import { baseGoerliOpStackChain } from '@/chains/baseGoerli'
import { baseSepoliaOpStackChain } from '@/chains/baseSepolia'
import { lyraSepoliaOpStackChain } from '@/chains/lyraSepolia'
import { modeSepoliaOpStackChain } from '@/chains/modeSepolia'
import { optimismGoerliOpStackChain } from '@/chains/optimismGoerli'
import { optimismSepoliaOpStackChain } from '@/chains/optimismSepolia'
import { orderlySepoliaOpStackChain } from '@/chains/orderlySepolia'
import { pgnSepoliaOpStackChain } from '@/chains/pgnSepolia'
import { zoraSepoliaOpStackChain } from '@/chains/zoraSepolia'

// TODO use the opStackChain config as source of truth
// export const opStackChainByL2ChainId = {
//   [baseGoerli.id]: baseGoerliOpStackChain,
//   [baseSepolia.id]: baseSepoliaOpStackChain,
//   [optimismSepolia.id]: optimismSepoliaOpStackChain,
//   [optimismGoerli.id]: optimismGoerliOpStackChain,
//   [pgnSepolia.id]: pgnSepoliaOpStackChain,
//   [zoraSepolia.id]: zoraSepoliaOpStackChain,
//   [modeSepolia.id]: modeSepoliaOpStackChain,
//   [orderlySepolia.id]: orderlySepoliaOpStackChain,
//   [lyraSepolia.id]: lyraSepoliaOpStackChain,
// } as const

export const opStackChains = [
  optimismGoerliOpStackChain,
  baseGoerliOpStackChain,
  optimismSepoliaOpStackChain,
  baseSepoliaOpStackChain,
  pgnSepoliaOpStackChain,
  zoraSepoliaOpStackChain,
  modeSepoliaOpStackChain,
  orderlySepoliaOpStackChain,
  lyraSepoliaOpStackChain,
]
