import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useContractAbi } from '@/lib/getContractAbi'
import { useCrossDomainMessagesForTransactionHash } from '@/lib/getCrossDomainMessagesForTransactionHash'
import { optimismSepolia } from 'viem/chains'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  indexedChains,
  IndexedChainId,
} from '@superchain-testnet-tools/indexed-chains'
import { useState } from 'react'

const DestinationChainSelect = ({
  selectedChainId,
  setSelectedChainId,
}: {
  selectedChainId: IndexedChainId
  setSelectedChainId: (chainId: IndexedChainId) => void
}) => {
  return (
    <Select
      value={String(selectedChainId)}
      onValueChange={(value) =>
        setSelectedChainId(Number(value) as IndexedChainId)
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chain" />
      </SelectTrigger>
      <SelectContent>
        {indexedChains.map((chain) => {
          return (
            <SelectItem key={chain.id} value={String(chain.id)}>
              {chain.name}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export const MessagePasserPage = () => {
  const result = useCrossDomainMessagesForTransactionHash(
    '0x17b8b82bacec8b6f522f21c96d81a046c01dd1c25e41951502dcf3db5b1b8a93',
  )

  const [selectedChainId, setSelectedChainId] = useState<IndexedChainId>(
    indexedChains[0].id,
  )

  const { data } = useContractAbi({
    chainId: selectedChainId,
    address: '0x3870419ba2bbf0127060bcb37f69a1b1c090992b',
  })

  console.log(data)

  return (
    <div className="flex flex-col">
      under construction...
      <Card>
        <CardHeader>
          <CardTitle>Message passer</CardTitle>
        </CardHeader>
        <CardContent>
          <DestinationChainSelect
            selectedChainId={selectedChainId}
            setSelectedChainId={setSelectedChainId}
          />
        </CardContent>
      </Card>
    </div>
  )
}
