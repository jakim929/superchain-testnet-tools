import { ponder } from '@/generated'
import {
  getFailedRelayedMessageEventHandler,
  getRelayedMessageEventHandler,
  getSentMessageEventHandler,
  getSentMessageExtension1EventHandler,
} from '@/src/lib/eventHandlers'
import { optimismSepolia, sepolia } from 'viem/chains'

// OP Sepolia L1 => L2

ponder.on(
  `L1CrossDomainMessengerContract_${optimismSepolia.id}:SentMessage` as const,
  getSentMessageEventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: optimismSepolia.id,
  }),
)

ponder.on(
  `L1CrossDomainMessengerContract_${optimismSepolia.id}:SentMessageExtension1` as const,
  getSentMessageExtension1EventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: optimismSepolia.id,
  }),
)

ponder.on(
  `L2CrossDomainMessengerContract_${optimismSepolia.id}:RelayedMessage` as const,
  getRelayedMessageEventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: optimismSepolia.id,
  }),
)

ponder.on(
  `L2CrossDomainMessengerContract_${optimismSepolia.id}:FailedRelayedMessage` as const,
  getFailedRelayedMessageEventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: sepolia.id,
    targetChainId: optimismSepolia.id,
  }),
)

// OP Sepolia L2 => L1

ponder.on(
  `L2CrossDomainMessengerContract_${optimismSepolia.id}:SentMessage` as const,
  getSentMessageEventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: optimismSepolia.id,
    targetChainId: sepolia.id,
  }),
)

ponder.on(
  `L2CrossDomainMessengerContract_${optimismSepolia.id}:SentMessageExtension1` as const,
  getSentMessageExtension1EventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: optimismSepolia.id,
    targetChainId: sepolia.id,
  }),
)

ponder.on(
  `L1CrossDomainMessengerContract_${optimismSepolia.id}:RelayedMessage` as const,
  getRelayedMessageEventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: optimismSepolia.id,
    targetChainId: sepolia.id,
  }),
)

ponder.on(
  `L1CrossDomainMessengerContract_${optimismSepolia.id}:FailedRelayedMessage` as const,
  getFailedRelayedMessageEventHandler({
    l2ChainId: optimismSepolia.id,
    sourceChainId: optimismSepolia.id,
    targetChainId: sepolia.id,
  }),
)
