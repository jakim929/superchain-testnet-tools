import type { Config } from '@ponder/core'
import { orderlySepolia } from '@superchain-testnet-tools/chains'
import { http } from 'viem'
import { optimismSepolia, sepolia } from 'viem/chains'

// todo: generate this from the opStackChains array

export const config: Config = {
  networks: [
    {
      name: sepolia.network,
      chainId: sepolia.id,
      transport: http(process.env.SEPOLIA_HTTP_RPC_URL),
    },
    {
      name: optimismSepolia.network,
      chainId: optimismSepolia.id,
      transport: http(process.env.OP_SEPOLIA_HTTP_RPC_URL),
      maxRpcRequestConcurrency: 2,
      pollingInterval: 5000,
    },
    {
      name: orderlySepolia.network,
      chainId: orderlySepolia.id,
      transport: http(process.env.ORDERLY_SEPOLIA_HTTP_RPC_URL),
      maxRpcRequestConcurrency: 2,
      pollingInterval: 5000,
    },
  ],
  contracts: [
    {
      name: `L1CrossDomainMessengerContract_${optimismSepolia.id}`,
      network: sepolia.network,
      address: '0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef',
      abi: './abis/CrossDomainMessenger.json',
      startBlock: 4071248,
    },
    {
      name: `L2CrossDomainMessengerContract_${optimismSepolia.id}`,
      network: optimismSepolia.network,
      address: '0x4200000000000000000000000000000000000007',
      abi: './abis/CrossDomainMessenger.json',
      startBlock: 0,
    },

    {
      name: `L1CrossDomainMessengerContract_${orderlySepolia.id}`,
      network: sepolia.network,
      address: '0x5FD6C8D6756C3327f7A368F1cfbc7c003BC7EFC9',
      abi: './abis/CrossDomainMessenger.json',
      startBlock: 4051204,
    },
    {
      name: `L2CrossDomainMessengerContract_${orderlySepolia.id}`,
      network: orderlySepolia.network,
      address: '0x4200000000000000000000000000000000000007',
      abi: './abis/CrossDomainMessenger.json',
      startBlock: 0,
    },
  ],
}
