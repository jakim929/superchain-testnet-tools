import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { defineChain } from 'viem'
import { optimismSepolia, sepolia } from 'viem/chains'

export const modeSepoliaOpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0xc19a60d9E8C27B9A43527c3283B4dd8eDC8bE15C',
    blockCreated: 3778394,
  },
  l1StandardBridge: {
    address: '0xbC5C679879B2965296756CD959C3C739769995E2',
    blockCreated: 3778392,
  },
} as const satisfies OpStackChainL1Contracts

export const modeSepolia = defineChain({
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
  formatters: optimismSepolia.formatters,
})

export const modeSepoliaOpStackChain = {
  l1Chain: sepolia,
  l2Chain: modeSepolia,
  l1Contracts: modeSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const satisfies OpStackChain
