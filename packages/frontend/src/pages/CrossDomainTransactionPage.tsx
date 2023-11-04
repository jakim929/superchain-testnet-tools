import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { indexedChainById } from '@/indexedChains'
import {
  CrossDomainMessageSubset,
  useCrossDomainMessagesForTransactionHash,
} from '@/lib/getCrossDomainMessagesForTransactionHash'
import { truncateHash } from '@/lib/truncateHash'
import { useParams } from 'react-router-dom'
import { Hex, formatEther } from 'viem'

const StatusChip = ({
  status,
}: { status: CrossDomainMessageSubset['status'] }) => {
  switch (status) {
    case 'SENT':
      return <Chip variant="progress">Sent</Chip>
    case 'RELAYED':
      return <Chip variant="success">Relayed</Chip>
    case 'FAILED':
      return <Chip variant="error">Failed</Chip>
  }
}

const TxNotFound = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-semibold">
        Transaction not found. Possible reasons
      </div>
      <div className="flex flex-col gap-2">
        <div>
          1. Only Base-Sepolia and OP-Sepolia are supported at the moment
        </div>
        <div>2. Transaction might not be related to a cross chain message</div>
        <div>3. Something is wrong with the indexer. Will be fixed soon!</div>
      </div>
    </div>
  )
}

const MessageProperty = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  return (
    <div className="flex ">
      <div className="flex-1 text-slate-400">{label}</div>
      <div className="flex-2">{value}</div>
    </div>
  )
}

const CrossDomainMessageCard = ({
  crossDomainMessage,
}: { crossDomainMessage: CrossDomainMessageSubset }) => {
  const {
    msgHash,
    status,
    value,
    target,
    sender,
    message,
    messageNonce,
    sourceChainId,
    targetChainId,
  } = crossDomainMessage
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{truncateHash(msgHash)}</CardTitle>
        <StatusChip status={status} />
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <MessageProperty
            label="Source"
            value={indexedChainById[sourceChainId].name}
          />

          <MessageProperty
            label="Destination"
            value={indexedChainById[targetChainId].name}
          />
          <MessageProperty label="Sender" value={`${truncateHash(sender)}`} />
          <MessageProperty label="Target" value={`${truncateHash(target)}`} />
          <MessageProperty label="Value" value={`${formatEther(value)} ETH`} />
        </div>
      </CardContent>
    </Card>
  )
}

// TODO: figure out SSR
export const CrossDomainTransactionPage = () => {
  const { transactionHash } = useParams()

  const { data, isLoading } = useCrossDomainMessagesForTransactionHash(
    transactionHash as Hex | undefined,
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <TxNotFound />
  }

  return (
    <div className="flex flex-col gap-4 w-[800px]">
      {data.map((crossDomainMessage) => (
        <CrossDomainMessageCard
          key={crossDomainMessage.id}
          crossDomainMessage={crossDomainMessage}
        />
      ))}
    </div>
  )
}
