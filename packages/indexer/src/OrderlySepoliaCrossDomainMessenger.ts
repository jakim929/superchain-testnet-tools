import { ponder } from '@/generated'
import {
  getFailedRelayedMessageEventHandler,
  getRelayedMessageEventHandler,
  getSentMessageEventHandler,
  getSentMessageExtension1EventHandler,
} from '@/src/lib/eventHandlers'
import { sepolia } from 'viem/chains'

const orderlySepolia = {
  id: 4460 as const,
  network: 'orderly-sepolia' as const,
} as const

// Orderly Sepolia L1 => L2

ponder.on(
  `L1CrossDomainMessengerContract_${orderlySepolia.id}:SentMessage` as const,
  getSentMessageEventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: orderlySepolia.id,
  }),
)

ponder.on(
  `L1CrossDomainMessengerContract_${orderlySepolia.id}:SentMessageExtension1` as const,
  getSentMessageExtension1EventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: orderlySepolia.id,
  }),
)

ponder.on(
  `L2CrossDomainMessengerContract_${orderlySepolia.id}:RelayedMessage` as const,
  getRelayedMessageEventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: orderlySepolia.id,
  }),
)

ponder.on(
  `L2CrossDomainMessengerContract_${orderlySepolia.id}:FailedRelayedMessage` as const,
  getFailedRelayedMessageEventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: orderlySepolia.id,
  }),
)

// Orderly Sepolia L2 => L1

ponder.on(
  `L2CrossDomainMessengerContract_${orderlySepolia.id}:SentMessage` as const,
  getSentMessageEventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: orderlySepolia.id,
    targetChainId: sepolia.id,
  }),
)

ponder.on(
  `L2CrossDomainMessengerContract_${orderlySepolia.id}:SentMessageExtension1` as const,
  getSentMessageExtension1EventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: orderlySepolia.id,
    targetChainId: sepolia.id,
  }),
)

ponder.on(
  `L1CrossDomainMessengerContract_${orderlySepolia.id}:RelayedMessage` as const,
  getRelayedMessageEventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: orderlySepolia.id,
    targetChainId: sepolia.id,
  }),
)

ponder.on(
  `L1CrossDomainMessengerContract_${orderlySepolia.id}:FailedRelayedMessage` as const,
  getFailedRelayedMessageEventHandler({
    l2ChainId: orderlySepolia.id,
    sourceChainId: orderlySepolia.id,
    targetChainId: sepolia.id,
  }),
)
