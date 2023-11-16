import { Address } from 'viem'
import { z } from 'zod'
import { Abi as AbiSchema } from 'abitype/zod'
import { baseSepolia, goerli, optimismSepolia, sepolia } from 'viem/chains'
import { AddressSchema } from '@superchain-testnet-tools/common-ts'
import {
  lyraSepolia,
  modeSepolia,
  orderlySepolia,
  zoraSepolia,
} from '@superchain-testnet-tools/chains'

type ChainBlockscoutConfig = {
  chainId: number
  apiUrl: string
}

const getApiUrl = (blockExplorerBaseUrl: string) => {
  return `${blockExplorerBaseUrl}/api/v2`
}

const sepoliaBlockscoutConfig = {
  chainId: sepolia.id,
  apiUrl: 'https://eth-sepolia.blockscout.com/api/v2',
} as const satisfies ChainBlockscoutConfig

const goerliBlockscoutConfig = {
  chainId: goerli.id,
  apiUrl: 'https://eth-goerli.blockscout.com/api/v2',
} as const satisfies ChainBlockscoutConfig

const opSepoliaBlockscoutConfig = {
  chainId: optimismSepolia.id,
  apiUrl: 'https://optimism-sepolia.blockscout.com/api/v2',
} as const satisfies ChainBlockscoutConfig

const baseSepoliaBlockscoutConfig = {
  chainId: baseSepolia.id,
  apiUrl: 'https://base-sepolia.blockscout.com/api/v2',
} as const satisfies ChainBlockscoutConfig

const orderlySepoliaBlockscoutConfig = {
  chainId: orderlySepolia.id,
  apiUrl: getApiUrl(orderlySepolia.blockExplorers.default.url),
} as const satisfies ChainBlockscoutConfig

const zoraSepoliaBlockscoutConfig = {
  chainId: zoraSepolia.id,
  apiUrl: getApiUrl(zoraSepolia.blockExplorers.default.url),
} as const satisfies ChainBlockscoutConfig

const modeSepoliaBlockscoutConfig = {
  chainId: modeSepolia.id,
  apiUrl: getApiUrl(modeSepolia.blockExplorers.default.url),
} as const satisfies ChainBlockscoutConfig

const lyraSepoliaBlockscoutConfig = {
  chainId: lyraSepolia.id,
  apiUrl: getApiUrl(lyraSepolia.blockExplorers.default.url),
} as const satisfies ChainBlockscoutConfig

const blockscoutConfigs = [
  sepoliaBlockscoutConfig,
  goerliBlockscoutConfig,
  opSepoliaBlockscoutConfig,
  baseSepoliaBlockscoutConfig,
  orderlySepoliaBlockscoutConfig,
  zoraSepoliaBlockscoutConfig,
  modeSepoliaBlockscoutConfig,
  lyraSepoliaBlockscoutConfig,
] as const

export const blockscoutSupportedChainIds = blockscoutConfigs.map(
  (x) => x.chainId,
)

export const blockscoutSupportedChainIdSet = new Set(
  blockscoutSupportedChainIds,
)

export type BlockscoutSupportedChainId =
  typeof blockscoutSupportedChainIds[number]

const blockscoutConfigByChainId = blockscoutConfigs.reduce<
  Record<BlockscoutSupportedChainId, ChainBlockscoutConfig>
>((acc, val) => {
  acc[val.chainId] = val
  return acc
}, {} as any)

const BlockscoutV2SmartContractResponseSchema = z.object({
  deployed_bytecode: z.string(),
  abi: AbiSchema.nullable().optional(),
  minimal_proxy_address_hash: AddressSchema.nullable().optional(),
  name: z.string().nullable().optional(),
  source_code: z.string().nullable().nullable().optional(),
})

const BlockscoutV2SmartContractResponseToContractMetadataSchema =
  BlockscoutV2SmartContractResponseSchema.transform(
    ({
      abi,
      minimal_proxy_address_hash,
      name,
      source_code,
      deployed_bytecode,
    }) => {
      console.log(abi, source_code, name, minimal_proxy_address_hash)
      // means contract is deployed at this address but not verified
      if (!deployed_bytecode || !name || !source_code || !abi) {
        return null
      }
      return {
        source: 'blockscout' as const,
        abi,
        implementationAddress: minimal_proxy_address_hash || null,
        name,
        sourceCode: source_code,
      }
    },
  )

export const fetchContractMetadataFromBlockscout = async (
  chainId: BlockscoutSupportedChainId,
  address: Address,
) => {
  const { apiUrl } = blockscoutConfigByChainId[chainId]

  const result = await fetch(`${apiUrl}/smart-contracts/${address}`)
  if (result.status === 404) {
    return null
  }
  if (result.status !== 200) {
    throw Error(
      `[fetchContractMetadataFromBlockscout] Unexpected status code ${result.status}`,
    )
  }

  const response = await result.json()
  const { deployed_bytecode, ...rest } = response
  console.log('rest', rest)

  return BlockscoutV2SmartContractResponseToContractMetadataSchema.parse(
    response,
  )
}
