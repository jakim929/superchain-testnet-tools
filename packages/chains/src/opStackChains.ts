import { baseGoerliOpStackChain } from './baseGoerli'
import { baseSepoliaOpStackChain } from './baseSepolia'
import { lyraSepoliaOpStackChain } from './lyraSepolia'
import { modeSepoliaOpStackChain } from './modeSepolia'
import { optimismGoerliOpStackChain } from './optimismGoerli'
import { optimismSepoliaOpStackChain } from './optimismSepolia'
import { orderlySepoliaOpStackChain } from './orderlySepolia'
import { pgnSepoliaOpStackChain } from './pgnSepolia'
import { zoraSepoliaOpStackChain } from './zoraSepolia'
import { OpStackChain } from './types/OpStackChain'
import { Address } from 'viem'
import { goerli, sepolia } from 'viem/chains'

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

export const opStackChainByL2ChainId = opStackChains.reduce<
  Record<number, OpStackChain>
>((acc, opStackChain) => {
  acc[opStackChain.l2Chain.id] = opStackChain
  return acc
}, {})

export const sepoliaOpStackChainByL1CrossDomainMessengerAddress = opStackChains
  .filter((x) => x.l1Chain.id === sepolia.id)
  .reduce<Record<Address, OpStackChain>>((acc, opStackChain) => {
    acc[opStackChain.l1Contracts.l1CrossDomainMessenger.address] = opStackChain
    return acc
  }, {})

export const goerliOpStackChainByL1CrossDomainMessengerAddress = opStackChains
  .filter((x) => x.l1Chain.id === goerli.id)
  .reduce<Record<Address, OpStackChain>>((acc, opStackChain) => {
    acc[opStackChain.l1Contracts.l1CrossDomainMessenger.address] = opStackChain
    return acc
  }, {})
