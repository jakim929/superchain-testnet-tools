import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { sepolia, worldchainSepolia } from 'viem/chains'

const worldchainSepoliaOpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x7768c821200554d8F359A8902905Ba9eDe5659a9',
    blockCreated: 6278161,
  },
  l1StandardBridge: {
    address: '0xd7DF54b3989855eb66497301a4aAEc33Dbb3F8DE',
    blockCreated: 6278161,
  },
} as const satisfies OpStackChainL1Contracts

export const worldchainSepoliaOpStackChain = {
  l1Chain: sepolia,
  l2Chain: worldchainSepolia,
  l1Contracts: worldchainSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const satisfies OpStackChain
