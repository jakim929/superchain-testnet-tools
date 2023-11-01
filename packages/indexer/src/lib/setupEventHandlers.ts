import { ponder } from '@/generated'
import {
  getFailedRelayedMessageEventHandler,
  getRelayedMessageEventHandler,
  getSentMessageEventHandler,
  getSentMessageExtension1EventHandler,
} from '@/src/lib/eventHandlers'
import { IndexedOpStackChain } from '@superchain-testnet-tools/indexed-chains'

export const setupEventHandlers = (
  opStackChain: IndexedOpStackChain,
) => {
  const l1ChainId = opStackChain.l1Chain.id
  const l2ChainId = opStackChain.l2Chain.id

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

  // Orderly Sepolia L2 => L1

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
