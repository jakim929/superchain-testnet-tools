import { AppType } from '@/generated'
import { maybeUpdateCrossDomainMessage } from '@/src/handlers/maybeUpdateCrossDomainMessage'
import {
  getCrossDomainMessageKey,
  getFailedRelayedMessageEventKey,
} from '@/src/lib/keyFactories'

type FailedRelayedMessageEventHandler =
  AppType['L1CrossDomainMessengerContract_11155420:FailedRelayedMessage']

export const getFailedRelayedMessageEventHandler = ({
  l2ChainId,
  sourceChainId,
  targetChainId,
}: {
  l2ChainId: number
  sourceChainId: number
  targetChainId: number
}): FailedRelayedMessageEventHandler => {
  return async ({ event, context }) => {
    const { RelayedMessageEvent, CrossDomainMessage } = context.entities

    const eventId = getFailedRelayedMessageEventKey({
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
          status: 'FAILED',
          lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
          latestFailedRelayedMessageEvent: eventId,
          transactionHashes: [...transactionHashes, event.transaction.hash],
        }
      },
    )
  }
}
