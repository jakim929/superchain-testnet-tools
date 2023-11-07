import { envVars } from '@/envVars'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

const getContractAbiQueryKey = ({
  chainId,
  address,
}: {
  chainId: number
  address: Address
}) => {
  return ['ContractAbi', chainId, address]
}

export const getContractAbi = async ({
  chainId,
  address,
}: {
  chainId: number
  address: Address
}) => {
  const result = await fetch(
    `${envVars.VITE_CONTRACT_LOOKUP_SERVICE_URL}/contract-metadata/${chainId}/${address}`,
  )
  return await result.json()
}

export const useContractAbi = ({
  chainId,
  address,
}: {
  chainId?: number
  address?: Address
}) => {
  return useQuery({
    queryKey:
      chainId && address ? getContractAbiQueryKey({ chainId, address }) : [],
    queryFn: () =>
      getContractAbi({
        chainId: chainId!,
        address: address!,
      }),
    enabled: Boolean(address && chainId),
    staleTime: Infinity,
  })
}
