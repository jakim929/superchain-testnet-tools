import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { optimismSepolia, sepolia } from 'viem/chains'

const optimismSepoliaOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef',
    blockCreated: 4071248,
  },
  l1StandardBridge: {
    address: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
    blockCreated: 4071248,
  },
}

export const optimismSepoliaOpStackChain: OpStackChain = {
  l1Chain: sepolia,
  l2Chain: optimismSepolia,
  l1Contracts: optimismSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
