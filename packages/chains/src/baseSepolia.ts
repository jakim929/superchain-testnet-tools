import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { baseSepolia, sepolia } from 'viem/chains'

export const baseSepoliaOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0xC34855F4De64F1840e5686e64278da901e261f20',
  },
  l1StandardBridge: {
    address: '0xfd0Bf71F60660E2f608ed56e1659C450eB113120',
  },
}

export const baseSepoliaOpStackChain: OpStackChain = {
  l1Chain: sepolia,
  l2Chain: baseSepolia,
  l1Contracts: baseSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
