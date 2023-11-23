import { ponder } from '@/generated'

import {
  getSentMessageEventHandler,
  getSentMessageExtension1EventHandler,
  getRelayedMessageEventHandler,
  getFailedRelayedMessageEventHandler,
} from '@/src/handlers'

import { IndexedOpStackChain } from '@superchain-testnet-tools/indexed-chains'

export const setupEventHandlers = (opStackChain: IndexedOpStackChain) => {
  const l1ChainId = opStackChain.l1Chain.id
  const l2ChainId = opStackChain.l2Chain.id

  console.log('setting up handler for ', l1ChainId, l2ChainId)

  // L1 => L2 messages

  ponder.on(
    `L1CrossDomainMessengerContract_${l2ChainId}:SentMessage` as const,
    getSentMessageEventHandler({
      l2ChainId,
      sourceChainId: l1ChainId,
      targetChainId: l2ChainId,
    }),
  )

  ponder.on(
    `L1CrossDomainMessengerContract_${l2ChainId}:SentMessageExtension1` as const,
    getSentMessageExtension1EventHandler({
      l2ChainId,
      sourceChainId: l1ChainId,
      targetChainId: l2ChainId,
    }),
  )

  ponder.on(
    `L2CrossDomainMessengerContract_${l2ChainId}:RelayedMessage` as const,
    getRelayedMessageEventHandler({
      l2ChainId: l2ChainId,
      sourceChainId: l1ChainId,
      targetChainId: l2ChainId,
    }),
  )

  ponder.on(
    `L2CrossDomainMessengerContract_${l2ChainId}:FailedRelayedMessage` as const,
    getFailedRelayedMessageEventHandler({
      l2ChainId: l2ChainId,
      sourceChainId: l1ChainId,
      targetChainId: l2ChainId,
    }),
  )

  // L2 => L1 messages

  ponder.on(
    `L2CrossDomainMessengerContract_${l2ChainId}:SentMessage` as const,
    getSentMessageEventHandler({
      l2ChainId: l2ChainId,
      sourceChainId: l2ChainId,
      targetChainId: l1ChainId,
    }),
  )

  ponder.on(
    `L2CrossDomainMessengerContract_${l2ChainId}:SentMessageExtension1` as const,
    getSentMessageExtension1EventHandler({
      l2ChainId: l2ChainId,
      sourceChainId: l2ChainId,
      targetChainId: l1ChainId,
    }),
  )

  ponder.on(
    `L1CrossDomainMessengerContract_${l2ChainId}:RelayedMessage` as const,
    getRelayedMessageEventHandler({
      l2ChainId: l2ChainId,
      sourceChainId: l2ChainId,
      targetChainId: l1ChainId,
    }),
  )

  ponder.on(
    `L1CrossDomainMessengerContract_${l2ChainId}:FailedRelayedMessage` as const,
    getFailedRelayedMessageEventHandler({
      l2ChainId: l2ChainId,
      sourceChainId: l2ChainId,
      targetChainId: l1ChainId,
    }),
  )
}
