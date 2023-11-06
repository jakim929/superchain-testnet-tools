import { Address } from 'viem'
import { z } from 'zod'
import { Abi as AbiSchema } from 'abitype/zod'
import { baseSepolia, goerli, optimismSepolia, sepolia } from 'viem/chains'
import { AddressSchema } from '@superchain-testnet-tools/common-ts'

type ChainBlockscoutConfig = {
  chainId: number
  apiUrl: string
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

const blockscoutConfigs = [
  sepoliaBlockscoutConfig,
  goerliBlockscoutConfig,
  opSepoliaBlockscoutConfig,
  baseSepoliaBlockscoutConfig,
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
  abi: AbiSchema.nullable(),
  minimal_proxy_address_hash: AddressSchema.nullable(),
  name: z.string().nullable(),
  source_code: z.string().nullable().nullable(),
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
      // means contract is deployed at this address but not verified
      if (!deployed_bytecode || !name || !source_code || !abi) {
        return null
      }
      return {
        source: 'blockscout' as const,
        abi,
        implementationAddress: minimal_proxy_address_hash,
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
  if (result.status === 200) {
    const response = await result.json()
    return BlockscoutV2SmartContractResponseToContractMetadataSchema.parse(
      response,
    )
  } else {
    throw Error(
      `[fetchContractMetadataFromBlockscout] Unexpected status code ${result.status}`,
    )
  }
}
