import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'
import { formattersOptimism } from 'viem/chains/utils'

export const modeSepoliaOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0xc19a60d9E8C27B9A43527c3283B4dd8eDC8bE15C',
  },
  l1StandardBridge: {
    address: '0xbC5C679879B2965296756CD959C3C739769995E2',
  },
}

export const modeSepolia = defineChain(
  {
    id: 919,
    network: 'mode-sepolia',
    name: 'Mode Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://l2-mode-sepolia-vtnhnpim72.t.conduit.xyz'],
      },
      public: {
        http: ['https://l2-mode-sepolia-vtnhnpim72.t.conduit.xyz'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Conduit',
        url: 'https://explorerl2-mode-sepolia-vtnhnpim72.t.conduit.xyz',
      },
    },
    testnet: true,
    sourceId: 11155111, // sepolia
  },
  {
    formatters: formattersOptimism,
  },
)

export const modeSepoliaOpStackChain: OpStackChain = {
  l1Chain: sepolia,
  l2Chain: modeSepolia,
  l1Contracts: modeSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
