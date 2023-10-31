import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'
import { formattersOptimism } from 'viem/chains/utils'

const zoraSepoliaOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x1bDBC0ae22bEc0c2f08B4dd836944b3E28fe9b7A',
  },
  l1StandardBridge: {
    address: '0x5376f1D543dcbB5BD416c56C189e4cB7399fCcCB',
  },
}

export const zoraSepolia = defineChain(
  {
    id: 999999999,
    network: 'zora-sepolia',
    name: 'Zora Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://l2-zora-sepolia-0thyhxtf5e.t.conduit.xyz'],
      },
      public: {
        http: ['https://l2-zora-sepolia-0thyhxtf5e.t.conduit.xyz'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Conduit',
        url: 'https://explorerl2-zora-sepolia-0thyhxtf5e.t.conduit.xyz',
      },
    },
    testnet: true,
    sourceId: 11155111, // sepolia
  },
  {
    formatters: formattersOptimism,
  },
)

export const zoraSepoliaOpStackChain: OpStackChain = {
  l1Chain: sepolia,
  l2Chain: zoraSepolia,
  l1Contracts: zoraSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
