import { AppType } from '@/generated'
import { Address, Hex } from 'viem'
import { calculateMsgHash } from '@/src/lib/calculateMsgHash'

const getCrossDomainMessageKey = ({
  msgHash,
  sourceChainId,
  targetChainId,
}: {
  msgHash: string
  sourceChainId: number
  targetChainId: number
}) => {
  return `${sourceChainId}_${targetChainId}_${msgHash}`
}

const getSentMessageEventKey = ({
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

const getSentMessageExtension1EventKey = ({
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

const getFailedRelayedMessageEventKey = ({
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

type SentMessageExtension1EventHandler =
  AppType['L1CrossDomainMessengerContract_11155420:SentMessageExtension1']

export const getSentMessageExtension1EventHandler = ({
  l2ChainId,
  sourceChainId,
  targetChainId,
}: {
  l2ChainId: number
  sourceChainId: number
  targetChainId: number
}): SentMessageExtension1EventHandler => {
  return async ({ event, context }) => {
    const { SentMessageExtension1Event, SentMessageEvent, CrossDomainMessage } =
      context.entities

    const results = await SentMessageEvent.findMany({
      where: {
        sourceChainId: {
          equals: sourceChainId,
        },
        targetChainId: {
          equals: targetChainId,
        },
        transactionHash: {
          equals: event.transaction.hash,
        },
        logIndex: {
          equals: event.log.logIndex - 1,
        },
      },
    })

    const sentMessageEvent = results[0]

    if (!sentMessageEvent) {
      console.error(
        '[SentMessageExtension1EventHandler]: returning early for log',
        event.log.logIndex,
      )
      return
    }

    const sentMessageExtension1EventKey = getSentMessageExtension1EventKey({
      logId: event.log.id,
      sourceChainId: sourceChainId,
      targetChainId: targetChainId,
    })

    await SentMessageExtension1Event.create({
      id: sentMessageExtension1EventKey,
      data: {
        opStackChain: l2ChainId,
        sourceChainId: sourceChainId,
        targetChainId: targetChainId,
        sender: event.params.sender,
        value: event.params.value,
        blockTimestamp: Number(event.block.timestamp),
        transactionHash: event.transaction.hash,
        logIndex: event.log.logIndex,
      },
    })

    const data = {
      opStackChain: l2ChainId,
      status: 'SENT' as const,
      sourceChainId: sourceChainId,
      targetChainId: targetChainId,
      target: sentMessageEvent.target,
      sender: sentMessageEvent.sender,
      message: sentMessageEvent.message,
      messageNonce: sentMessageEvent.messageNonce,
      gasLimit: sentMessageEvent.gasLimit,
      value: event.params.value,
      lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
      sentMessageEvent: sentMessageEvent.id,
      sentMessageExtension1Event: sentMessageExtension1EventKey,
    }

    const msgHash = calculateMsgHash({
      nonce: data.messageNonce,
      sender: data.sender as Address,
      target: data.target as Address,
      value: data.value,
      gasLimit: data.gasLimit,
      data: data.message as Hex,
    })

    await CrossDomainMessage.create({
      id: getCrossDomainMessageKey({
        msgHash: msgHash,
        sourceChainId,
        targetChainId,
      }),
      data,
    })
  }
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

    await CrossDomainMessage.update({
      id: getCrossDomainMessageKey({
        msgHash: event.params.msgHash,
        sourceChainId,
        targetChainId,
      }),
      data: {
        status: 'RELAYED',
        lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
        relayedMessageEvent: eventId,
      },
    })
  }
}

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

    await CrossDomainMessage.update({
      id: getCrossDomainMessageKey({
        msgHash: event.params.msgHash,
        sourceChainId,
        targetChainId,
      }),
      data: {
        status: 'FAILED',
        lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
        failedRelayedMessageEvent: eventId,
      },
    })
  }
}
