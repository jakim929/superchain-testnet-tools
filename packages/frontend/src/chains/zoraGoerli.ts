import { opStackChainL2PredeployContracts } from '@/chains/opStackChainL2PredeployContracts'
import { OpStackChain } from '@/chains/types/OpStackChain'
import { OpStackChainL1Contracts } from '@/chains/types/OpStackChainContracts'
import { goerli, zoraTestnet } from 'viem/chains'

export const zoraGoerliOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x9779A9D2f3B66A4F4d27cB99Ab6cC1266b3Ca9af',
  },
  l1StandardBridge: {
    address: '0x39CCDe9769d52d61189AB799d91665A11b5f3464',
  },
}

export const zoraGoerliOpStackChain: OpStackChain = {
  l1Chain: goerli,
  l2Chain: zoraTestnet,
  l1Contracts: zoraGoerliOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
