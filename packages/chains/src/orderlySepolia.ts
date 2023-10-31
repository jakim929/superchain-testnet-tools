import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'
import { formattersOptimism } from 'viem/chains/utils'

export const orderlySepoliaOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x5FD6C8D6756C3327f7A368F1cfbc7c003BC7EFC9',
    blockCreated: 4051204,
  },
  l1StandardBridge: {
    address: '0x1Af0494040d6904A9F3EE21921de4b359C736333',
  },
}

export const orderlySepolia = defineChain(
  {
    id: 4460,
    network: 'orderly-sepolia',
    name: 'Orderly Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://l2-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz'],
      },
      public: {
        http: ['https://l2-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Conduit',
        url: 'https://explorerl2-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz',
      },
    },
    testnet: true,
    sourceId: 11155111, // sepolia
  },
  {
    formatters: formattersOptimism,
  },
)

export const orderlySepoliaOpStackChain: OpStackChain = {
  l1Chain: sepolia,
  l2Chain: orderlySepolia,
  l1Contracts: orderlySepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
