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
  let result;
  if (etherscanSupportedChainIdSet.has(chainId as any)) {
    result = await fetchContractMetadataFromEtherscan(
      chainId as EtherscanSupportedChainId,
      address,
    )
  }
  
  if (blockscoutSupportedChainIdSet.has(chainId as any) && !result) {
    result = await fetchContractMetadataFromBlockscout(
      chainId as BlockscoutSupportedChainId,
      address,
    )
  } 

  return result || null
}
