import {
  AppType,
  RelayedMessageEvent,
  FailedRelayedMessageEvent,
} from '@/generated'
import { Address, Hex } from 'viem'
import { getCrossDomainMessageHash } from '@superchain-testnet-tools/common-ts'
import { Model } from '@ponder/core'
import { sortBy } from '@/src/lib/sortBy'

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

const getEventWithMetadataGetter = (status: 'RELAYED' | 'FAILED') => {
  return (event: RelayedMessageEvent | FailedRelayedMessageEvent) => {
    const { blockTimestamp, transactionHash } = event
    return {
      status,
      lastUpdatedAtBlockTimestamp: blockTimestamp,
      transactionHash,
      event,
    }
  }
}

const getCrossDomainMessageParamsFromTargetChainEvents = async (
  {
    sourceChainId,
    targetChainId,
    msgHash,
  }: { sourceChainId: number; targetChainId: number; msgHash: Hex },
  RelayedMessageEvent: Model<RelayedMessageEvent>,
  FailedRelayedMessageEvent: Model<FailedRelayedMessageEvent>,
) => {
  const [relayedMessageEvents, failedRelayedMessageEvents] = await Promise.all([
    RelayedMessageEvent.findMany({
      where: {
        sourceChainId,
        targetChainId,
        msgHash,
      },
    }),
    FailedRelayedMessageEvent.findMany({
      where: {
        sourceChainId,
        targetChainId,
        msgHash,
      },
    }),
  ])

  if (
    relayedMessageEvents.length === 0 &&
    failedRelayedMessageEvents.length === 0
  ) {
    return
  }

  if (relayedMessageEvents.length > 1) {
    throw new Error(
      `More than one RelayedMessageEvent found for msgHash ${msgHash} for sourceChainId ${sourceChainId} and targetChainId ${targetChainId}`,
    )
  }

  const sortedEventsWithMetadata = sortBy(
    [
      ...relayedMessageEvents.map(getEventWithMetadataGetter('RELAYED')),
      ...failedRelayedMessageEvents.map(getEventWithMetadataGetter('FAILED')),
    ],
    ({ lastUpdatedAtBlockTimestamp }) => lastUpdatedAtBlockTimestamp,
    'asc',
  )

  const sortedFailedEventsMetadata = sortedEventsWithMetadata.filter(
    (x) => x.status === 'FAILED',
  )

  const latestEvent =
    sortedEventsWithMetadata[sortedEventsWithMetadata.length - 1]

  const latestFailedRelayedMessageEvent =
    sortedFailedEventsMetadata[sortedFailedEventsMetadata.length - 1] || null

  return {
    status: latestEvent.status,
    lastUpdatedAtBlockTimestamp: latestEvent.lastUpdatedAtBlockTimestamp,
    transactionHashes: sortedEventsWithMetadata.map(
      ({ transactionHash }) => transactionHash,
    ),
    // there should only be one of these
    relayedMessageEvent: relayedMessageEvents[0]?.id,
    latestFailedRelayedMessageEvent: latestFailedRelayedMessageEvent?.event.id,
  }
}

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
    const {
      SentMessageExtension1Event,
      SentMessageEvent,
      CrossDomainMessage,
      RelayedMessageEvent,
      FailedRelayedMessageEvent,
    } = context.entities

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
          // TODO: this is a hack to match the SentMessageExtension1Event to the SentMessageEvent
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

    const msgHash = getCrossDomainMessageHash({
      nonce: sentMessageEvent.messageNonce,
      sender: sentMessageEvent.sender as Address,
      target: sentMessageEvent.target as Address,
      value: event.params.value,
      gasLimit: sentMessageEvent.gasLimit,
      data: sentMessageEvent.message as Hex,
    })

    const crossDomainMessageKey = getCrossDomainMessageKey({
      msgHash,
      sourceChainId,
      targetChainId,
    })

    // It's possible that the target chain transaction has already been indexed before this one. Add the fields in retroactively
    const paramsFromTargetChainEvents =
      await getCrossDomainMessageParamsFromTargetChainEvents(
        {
          sourceChainId,
          targetChainId,
          msgHash,
        },
        RelayedMessageEvent,
        FailedRelayedMessageEvent,
      )

    const data = {
      opStackChain: l2ChainId,
      status: paramsFromTargetChainEvents
        ? paramsFromTargetChainEvents.status
        : ('SENT' as const),
      msgHash,
      sourceChainId: sourceChainId,
      targetChainId: targetChainId,
      target: sentMessageEvent.target,
      sender: sentMessageEvent.sender,
      message: sentMessageEvent.message,
      messageNonce: sentMessageEvent.messageNonce,
      gasLimit: sentMessageEvent.gasLimit,
      value: event.params.value,
      lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
      sentMessageEventTransactionFrom: event.transaction.from,
      sentMessageEvent: sentMessageEvent.id,
      sentMessageExtension1Event: sentMessageExtension1EventKey,
      transactionHashes: [
        event.transaction.hash,
        ...(paramsFromTargetChainEvents?.transactionHashes || []),
      ],
      relayedMessageEvent: paramsFromTargetChainEvents?.relayedMessageEvent,
      latestFailedRelayedMessageEvent:
        paramsFromTargetChainEvents?.latestFailedRelayedMessageEvent,
    }

    await CrossDomainMessage.create({
      id: crossDomainMessageKey,
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

    const crossDomainMessageKey = getCrossDomainMessageKey({
      msgHash: event.params.msgHash,
      sourceChainId,
      targetChainId,
    })

    const crossDomainMessage = await CrossDomainMessage.findUnique({
      id: crossDomainMessageKey,
    })

    if (!crossDomainMessage) {
      // If the source transaction hasn't been indexed yet, do nothing
      // When the source transaction is indexed, it will update the crossDomainMessage with the target chain transaction as well
      return
    }

    await CrossDomainMessage.update({
      id: crossDomainMessageKey,
      data: ({ current }) => ({
        status: 'RELAYED',
        lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
        relayedMessageEvent: eventId,
        transactionHashes: [
          ...current.transactionHashes,
          event.transaction.hash,
        ],
      }),
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

    const crossDomainMessageKey = getCrossDomainMessageKey({
      msgHash: event.params.msgHash,
      sourceChainId,
      targetChainId,
    })

    const crossDomainMessage = await CrossDomainMessage.findUnique({
      id: crossDomainMessageKey,
    })

    if (!crossDomainMessage) {
      // If the source transaction hasn't been indexed yet, do nothing
      // When the source transaction is indexed, it will update the crossDomainMessage with the target chain transaction as well
      return
    }

    await CrossDomainMessage.update({
      id: crossDomainMessageKey,
      data: ({ current }) => ({
        status: 'FAILED',
        lastUpdatedAtBlockTimestamp: Number(event.block.timestamp),
        failedRelayedMessageEvent: eventId,
        transactionHashes: [
          ...current.transactionHashes,
          event.transaction.hash,
        ],
      }),
    })
  }
}
