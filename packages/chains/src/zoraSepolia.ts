import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { sepolia, zoraSepolia } from 'viem/chains'

const zoraSepoliaOpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x1bDBC0ae22bEc0c2f08B4dd836944b3E28fe9b7A',
    blockCreated: 4548045,
  },
  l1StandardBridge: {
    address: '0x5376f1D543dcbB5BD416c56C189e4cB7399fCcCB',
    blockCreated: 4548045,
  },
} as const satisfies OpStackChainL1Contracts

export const zoraSepoliaOpStackChain = {
  l1Chain: sepolia,
  l2Chain: zoraSepolia,
  l1Contracts: zoraSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const satisfies OpStackChain
