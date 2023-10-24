import { opStackChainL2PredeployContracts } from '@/chains/opStackChainL2PredeployContracts'
import { OpStackChain } from '@/chains/types/OpStackChain'
import { OpStackChainL1Contracts } from '@/chains/types/OpStackChainContracts'
import { goerli, optimismGoerli } from 'viem/chains'

const optimismGoerliOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x5086d1eEF304eb5284A0f6720f79403b4e9bE294',
    blockCreated: 7017129,
  },
  l1StandardBridge: {
    address: '0x636Af16bf2f682dD3109e60102b8E1A089FedAa8',
    blockCreated: 7017137,
  },
}

export const optimismGoerliOpStackChain: OpStackChain = {
  l1Chain: goerli,
  l2Chain: optimismGoerli,
  l1Contracts: optimismGoerliOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
