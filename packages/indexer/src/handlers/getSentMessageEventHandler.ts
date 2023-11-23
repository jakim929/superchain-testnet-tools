import { AppType } from '@/generated'
import { getSentMessageEventKey } from '@/src/lib/keyFactories'

type SentMessageEventHandler =
  AppType['L1CrossDomainMessengerContract_11155420:SentMessage']

export const getSentMessageEventHandler = ({
  l2ChainId,
  sourceChainId,
  targetChainId,
}: {
  l2ChainId: number
  sourceChainId: number
  targetChainId: number
}): SentMessageEventHandler => {
  return async ({ event, context }) => {
    // console.log('running getSentMessageEventHandler', event.log)
    const { SentMessageEvent } = context.entities

    await SentMessageEvent.create({
      id: getSentMessageEventKey({
        logId: event.log.id,
        sourceChainId,
        targetChainId,
      }),
      data: {
        opStackChain: l2ChainId,
        sourceChainId,
        targetChainId,
        target: event.params.target,
        sender: event.params.sender,
        message: event.params.message,
        messageNonce: event.params.messageNonce,
        gasLimit: event.params.gasLimit,
        blockTimestamp: Number(event.block.timestamp),
        transactionHash: event.transaction.hash,
        logIndex: event.log.logIndex,
      },
    })
  }
}
