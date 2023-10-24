import { opStackChainL2PredeployContracts } from '@/chains/opStackChainL2PredeployContracts'
import { OpStackChain } from '@/chains/types/OpStackChain'
import { OpStackChainL1Contracts } from '@/chains/types/OpStackChainContracts'
import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'
import { formattersOptimism } from 'viem/chains/utils'

export const pgnSepoliaOpStackChainL1Contracts: OpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x97f3558Ce48FE71B8CeFA5497708A49531D5A8E1',
    blockCreated: 3610369,
  },
  l1StandardBridge: {
    address: '0xFaE6abCAF30D23e233AC7faF747F2fC3a5a6Bfa3',
    blockCreated: 3610367,
  },
}

export const pgnSepolia = defineChain(
  {
    id: 58008,
    network: 'pgn-sepolia',
    name: 'PGN Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://sepolia.publicgoods.network'],
      },
      public: {
        http: ['https://sepolia.publicgoods.network'],
      },
    },
    blockExplorers: {
      blockscout: {
        name: 'Blockscout',
        url: 'https://explorer.sepolia.publicgoods.network/',
      },
      default: {
        name: 'Blockscout',
        url: 'https://explorer.sepolia.publicgoods.network/',
      },
    },
    testnet: true,
    sourceId: 11155111, // sepolia
  },
  {
    formatters: formattersOptimism,
  },
)

export const pgnSepoliaOpStackChain: OpStackChain = {
  l1Chain: sepolia,
  l2Chain: pgnSepolia,
  l1Contracts: pgnSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const
