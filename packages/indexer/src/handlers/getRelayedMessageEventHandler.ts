import { AppType } from '@/generated'
import { maybeUpdateCrossDomainMessage } from '@/src/handlers/maybeUpdateCrossDomainMessage'
import { getCrossDomainMessageKey } from '@/src/lib/keyFactories'

const getRelayedMessageEventKey = ({
  logId,
  sourceChainId,
  targetChainId,
}: {
  logId: string
  sourceChainId: number
  targetChainId: number
}) => {
  return `${sourceChainId}_${targetChainId}_${logId}`
}

type RelayedMessageEventHandler =
  AppType['L1CrossDomainMessengerContract_11155420:RelayedMessage']

export const getRelayedMessageEventHandler = ({
  l2ChainId,
  sourceChainId,
  targetChainId,
}: {
  l2ChainId: number
  sourceChainId: number
  targetChainId: number
}): RelayedMessageEventHandler => {
  return async ({ event, context }) => {
    const { RelayedMessageEvent, CrossDomainMessage } = context.entities

    const eventId = getRelayedMessageEventKey({
      logId: event.log.id,
      sourceChainId,
      targetChainId,
    })

    await RelayedMessageEvent.create({
      id: eventId,
      data: {
        opStackChain: l2ChainId,
        sourceChainId,
        targetChainId,
        msgHash: event.params.msgHash,
        blockTimestamp: Number(event.block.timestamp),
        transactionHash: event.transaction.hash,
        logIndex: event.log.logIndex,
      },
    })

    await maybeUpdateCrossDomainMessage(
      CrossDomainMessage,
      getCrossDomainMessageKey({
        msgHash: event.params.msgHash,
        sourceChainId,
        targetChainId,
      }),
      ({ transactionHashes }) => {
        return {
          status: 'RELAYED',
          lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
          relayedMessageEvent: eventId,
          transactionHashes: [...transactionHashes, event.transaction.hash],
        }
      },
    )
  }
}
