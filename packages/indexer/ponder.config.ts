import type { Config } from '@ponder/core'
import {
  lyraSepoliaOpStackChain,
  modeSepoliaOpStackChain,
  orderlySepoliaOpStackChain,
  zoraSepoliaOpStackChain,
} from '@superchain-testnet-tools/chains'
import {
  IndexedOpStackChain,
  indexedOpStackChains,
} from '@superchain-testnet-tools/indexed-chains'
import { http } from 'viem'
import { baseSepolia, optimismSepolia, sepolia } from 'viem/chains'

const getContractEventSources = (indexedOpStackChain: IndexedOpStackChain) => {
  const { l1Chain, l2Chain, l1Contracts, l2Contracts } = indexedOpStackChain

  return [
    {
      name: `L1CrossDomainMessengerContract_${l2Chain.id}`,
      network: l1Chain.network,
      address: l1Contracts.l1CrossDomainMessenger.address,
      abi: './abis/CrossDomainMessenger.json',
      startBlock: l1Contracts.l1CrossDomainMessenger.blockCreated,
    },
    {
      name: `L2CrossDomainMessengerContract_${l2Chain.id}`,
      network: l2Chain.network,
      address: l2Contracts.l2CrossDomainMessenger.address,
      abi: './abis/CrossDomainMessenger.json',
      startBlock: l2Contracts.l2CrossDomainMessenger.blockCreated,
    },
  ]
}

const getL2PublicRpcUrlNetworkConfig = (
  indexedOpStackChain: IndexedOpStackChain,
) => {
  const { l2Chain } = indexedOpStackChain

  return {
    name: l2Chain.network,
    chainId: l2Chain.id,
    transport: http(l2Chain.rpcUrls.default.http[0]),
    maxRpcRequestConcurrency: 2,
    pollingInterval: 3000,
  }
}

// TODO: combine the above two functions into one

export const config: Config = {
  networks: [
    {
      name: sepolia.network,
      chainId: sepolia.id,
      transport: http(process.env.SEPOLIA_HTTP_RPC_URL),
      maxRpcRequestConcurrency: 2,
      pollingInterval: 3000,
    },
    {
      name: optimismSepolia.network,
      chainId: optimismSepolia.id,
      transport: http(process.env.OP_SEPOLIA_HTTP_RPC_URL),
      maxRpcRequestConcurrency: 2,
      pollingInterval: 3000,
    },
    {
      name: baseSepolia.network,
      chainId: baseSepolia.id,
      transport: http(process.env.BASE_SEPOLIA_HTTP_RPC_URL),
      maxRpcRequestConcurrency: 2,
      pollingInterval: 3000,
    },
    getL2PublicRpcUrlNetworkConfig(orderlySepoliaOpStackChain),
    getL2PublicRpcUrlNetworkConfig(zoraSepoliaOpStackChain),
    getL2PublicRpcUrlNetworkConfig(modeSepoliaOpStackChain),
    getL2PublicRpcUrlNetworkConfig(lyraSepoliaOpStackChain),
  ],
  contracts: indexedOpStackChains.flatMap(getContractEventSources),
}
