import { Address } from 'viem'
import { ContractMetadataInsert } from '@/models/contractMetadatas'
import {
  EtherscanSupportedChainId,
  etherscanSupportedChainIdSet,
  etherscanSupportedChainIds,
  fetchContractMetadataFromEtherscan,
} from '@/metadataFetcher/fetchEtherscanContractMetadata'
import {
  BlockscoutSupportedChainId,
  blockscoutSupportedChainIdSet,
  blockscoutSupportedChainIds,
  fetchContractMetadataFromBlockscout,
} from '@/metadataFetcher/fetchBlockscoutContractMetadata'
type FetchedContractMetadata = Pick<
  ContractMetadataInsert,
  'source' | 'name' | 'abi' | 'sourceCode' | 'implementationAddress'
>

export const supportedChainIdSet = new Set([
  ...etherscanSupportedChainIds,
  ...blockscoutSupportedChainIds,
])

export const supportedChainIds = Array.from(supportedChainIdSet.values())

export type SupportedChainId = typeof supportedChainIds[number]

export const fetchContractMetadata = async (
  chainId: SupportedChainId,
  address: Address,
): Promise<FetchedContractMetadata | null> => {
  if (etherscanSupportedChainIdSet.has(chainId as any)) {
    return fetchContractMetadataFromEtherscan(
      chainId as EtherscanSupportedChainId,
      address,
    )
  }
  if (blockscoutSupportedChainIdSet.has(chainId as any)) {
    return fetchContractMetadataFromBlockscout(
      chainId as BlockscoutSupportedChainId,
      address,
    )
  }
  throw new Error(`Unsupported chainId: ${chainId}`)
}
