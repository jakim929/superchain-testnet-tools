import { opStackChainL2PredeployContracts } from './opStackChainL2PredeployContracts'
import { OpStackChain } from './types/OpStackChain'
import { OpStackChainL1Contracts } from './types/OpStackChainContracts'
import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'
import { formattersOptimism } from 'viem/chains/utils'

const lyraSepoliaOpStackChainL1Contracts = {
  l1CrossDomainMessenger: {
    address: '0x28976A1DF6e6689Bfe555780CD46dcFcF5552979',
  },
  l1StandardBridge: {
    address: '0x915f179A77FB2e1AeA8b56Ebc0D75A7e1A8a7A17',
  },
} as const satisfies OpStackChainL1Contracts

export const lyraSepolia = defineChain(
  {
    id: 901,
    network: 'lyra-sepolia',
    name: 'Lyra Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://l2-prod-testnet-0eakp60405.t.conduit.xyz'],
      },
      public: {
        http: ['https://l2-prod-testnet-0eakp60405.t.conduit.xyz'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Conduit',
        url: 'https://explorerl2-prod-testnet-0eakp60405.t.conduit.xyz',
      },
    },
    testnet: true,
    sourceId: 11155111, // sepolia
  },
  {
    formatters: formattersOptimism,
  },
)

export const lyraSepoliaOpStackChain = {
  l1Chain: sepolia,
  l2Chain: lyraSepolia,
  l1Contracts: lyraSepoliaOpStackChainL1Contracts,
  l2Contracts: opStackChainL2PredeployContracts,
} as const satisfies OpStackChain
