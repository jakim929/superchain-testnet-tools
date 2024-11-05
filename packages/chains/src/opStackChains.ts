import { baseSepoliaOpStackChain } from './baseSepolia'
import { modeSepoliaOpStackChain } from './modeSepolia'
import { optimismSepoliaOpStackChain } from './optimismSepolia'
import { zoraSepoliaOpStackChain } from './zoraSepolia'
import { OpStackChain } from './types/OpStackChain'
import { Address } from 'viem'
import { sepolia } from 'viem/chains'
import { unichainSepoliaOpStackChain } from './unichainSepolia'
import { worldchainSepoliaOpStackChain } from './worldchainSepolia'

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
  optimismSepoliaOpStackChain,
  baseSepoliaOpStackChain,
  zoraSepoliaOpStackChain,
  modeSepoliaOpStackChain,
  unichainSepoliaOpStackChain,
  worldchainSepoliaOpStackChain,
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
