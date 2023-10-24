import { OpStackChain } from '@/chains/types/OpStackChain'
import { OpStackChainL1Contracts } from '@/chains/types/OpStackChainContracts'
import { opStackChainL2PredeployContracts } from '@/chains/opStackChainL2PredeployContracts'
import { baseGoerli, goerli } from 'viem/chains'

export const baseGoerliOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x8e5693140eA606bcEB98761d9beB1BC87383706D',
  },
  l1StandardBridge: {
    address: '0xfA6D8Ee5BE770F84FC001D098C4bD604Fe01284a',
  },
}

export const baseGoerliOpStackChain: OpStackChain = {
  l1Chain: goerli,
  l2Chain: baseGoerli,
  l1Contracts: baseGoerliOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
