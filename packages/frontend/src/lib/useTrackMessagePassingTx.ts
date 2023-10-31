import { Chain, Hex } from 'viem'
import { useWaitForTransaction } from 'wagmi'

export const useTrackMessagePassingTx = (l1Chain: Chain, txHash?: Hex) => {
  const { isLoading, data } = useWaitForTransaction({
    hash: txHash,
    confirmations: 5,
  })
}
