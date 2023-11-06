import { Address } from 'viem'
import { z } from 'zod'
import { Abi as AbiSchema } from 'abitype/zod'
import {
  baseGoerli,
  goerli,
  optimismGoerli,
  optimismSepolia,
  sepolia,
} from 'viem/chains'
import { AddressSchema } from '@superchain-testnet-tools/common-ts'
import { envVars } from '@/envVars'

type ChainEtherscanConfig = {
  chainId: number
  apiUrl: string
  apiKey: string
}

const goerliEtherscanConfig = {
  chainId: goerli.id,
  apiUrl: 'https://api-goerli.etherscan.io/api',
  apiKey: envVars.ETHEREUM_ETHERSCAN_API_KEY,
} as const satisfies ChainEtherscanConfig

const sepoliaEtherscanConfig = {
  chainId: sepolia.id,
  apiUrl: 'https://api-sepolia.etherscan.io/api',
  apiKey: envVars.ETHEREUM_ETHERSCAN_API_KEY,
} as const satisfies ChainEtherscanConfig

const opSepoliaEtherscanConfig = {
  chainId: optimismSepolia.id,
  apiUrl: 'https://api-sepolia-optimistic.etherscan.io/api',
  apiKey: envVars.OPTIMISM_ETHERSCAN_API_KEY,
} as const satisfies ChainEtherscanConfig

const opGoerliEtherscanConfig = {
  chainId: optimismGoerli.id,
  apiUrl: 'https://api-goerli-optimistic.etherscan.io/api',
  apiKey: envVars.OPTIMISM_ETHERSCAN_API_KEY,
} as const satisfies ChainEtherscanConfig

const baseGoerliEtherscanConfig = {
  chainId: baseGoerli.id,
  apiUrl: 'https://api-goerli.basescan.org/api',
  apiKey: envVars.BASE_ETHERSCAN_API_KEY,
} as const satisfies ChainEtherscanConfig

const etherscanConfigs = [
  goerliEtherscanConfig,
  sepoliaEtherscanConfig,
  opSepoliaEtherscanConfig,
  opGoerliEtherscanConfig,
  baseGoerliEtherscanConfig,
] as const

export const etherscanSupportedChainIds = etherscanConfigs.map((x) => x.chainId)

export const etherscanSupportedChainIdSet = new Set(etherscanSupportedChainIds)

export type EtherscanSupportedChainId =
  typeof etherscanSupportedChainIds[number]

const etherscanConfigByChainId = etherscanConfigs.reduce<
  Record<EtherscanSupportedChainId, ChainEtherscanConfig>
>((acc, val) => {
  acc[val.chainId] = val
  return acc
}, {} as any)

const EtherscanGetSourceCodeResponseSchema = z.object({
  status: z.enum(['1', '0'] as const),
  result: z.array(
    z.object({
      SourceCode: z.string(),
      Implementation: z.string(),
      ContractName: z.string(),
      ABI: z.string(),
    }),
  ),
})

const EtherscanGetSourceCodeResponseToContractMetadataSchema =
  EtherscanGetSourceCodeResponseSchema.transform(({ status, result }) => {
    if (status !== '1') {
      return null
    }

    if (result.length === 0) {
      return null
    }

    const { SourceCode, Implementation, ContractName, ABI } = result[0]

    if (SourceCode === '' || ContractName === '' || ABI === '') {
      return null
    }

    return {
      source: 'etherscan' as const,
      abi: AbiSchema.parse(JSON.parse(ABI)),
      implementationAddress:
        Implementation === '' ? null : AddressSchema.parse(Implementation),
      name: ContractName,
      sourceCode: SourceCode,
    }
  })

export const fetchContractMetadataFromEtherscan = async (
  chainId: EtherscanSupportedChainId,
  address: Address,
) => {
  const { apiUrl, apiKey } = etherscanConfigByChainId[chainId]

  const result = await fetch(
    `${apiUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`,
  )

  if (result.status !== 200) {
    // Etherscan returns 200 even if not found
    throw Error(
      `[fetchContractMetadataFromEtherscan] Unexpected status code ${result.status}`,
    )
  }

  const response = await result.json()
  return EtherscanGetSourceCodeResponseToContractMetadataSchema.parse(response)
}
