import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { sepolia, unichainSepolia } from 'viem/chains'

const unichainSepoliaOpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x448A37330A60494E666F6DD60aD48d930AEbA381',
    blockCreated: 6728345,
  },
  l1StandardBridge: {
    address: '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2',
    blockCreated: 6728345,
  },
} as const satisfies OpStackChainL1Contracts

export const unichainSepoliaOpStackChain = {
  l1Chain: sepolia,
  l2Chain: unichainSepolia,
  l1Contracts: unichainSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const satisfies OpStackChain
