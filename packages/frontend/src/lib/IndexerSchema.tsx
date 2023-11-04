import { Hex } from 'viem'

import type { Address } from 'viem'
import { z } from 'zod'
import { IndexedChainId } from '@/indexedChains'

export const HexSchema = z
  .string()
  .refine((hex) => hex.startsWith('0x'))
  .transform((x) => x as Hex)

export const AddressSchema = HexSchema.refine(
  (hex) => hex.length === 42,
).transform((x) => x as Address)

export const OpStackChainSchema = z.object({
  id: z.number(),
  l1ChainId: z.number(),
  l2ChainId: z.number(),
})

export const StatusSchema = z.enum(['SENT', 'RELAYED', 'FAILED'] as const)

// TODO: consider changing to runtime validation as well
export const IndexedChainIdSchema = z
  .number()
  .transform((x) => x as IndexedChainId)

export const SentMessageEventSchema = z.object({
  id: z.string(),
  opStackChain: OpStackChainSchema,
  sourceChainId: IndexedChainIdSchema,
  targetChainId: IndexedChainIdSchema,
  target: AddressSchema,
  sender: AddressSchema,
  message: HexSchema,
  messageNonce: z.coerce.bigint(),
  gasLimit: z.coerce.bigint(),
  blockTimestamp: z.number(),
  transactionHash: HexSchema,
  logIndex: z.number(),
})

export const SentMessageExtension1EventSchema = z.object({
  id: z.string(),
  opStackChain: OpStackChainSchema,
  sourceChainId: IndexedChainIdSchema,
  targetChainId: IndexedChainIdSchema,
  sender: AddressSchema,
  value: z.coerce.bigint(),
  blockTimestamp: z.number(),
  transactionHash: HexSchema,
  logIndex: z.number(),
})

export const RelayedMessageEventSchema = z.object({
  id: z.string(),
  opStackChain: OpStackChainSchema,
  sourceChainId: IndexedChainIdSchema,
  targetChainId: IndexedChainIdSchema,
  sender: AddressSchema,
  value: z.coerce.bigint(),
  blockTimestamp: z.number(),
  transactionHash: HexSchema,
  logIndex: z.number(),
})

export const FailedRelayedMessageEventSchema = RelayedMessageEventSchema

export const CrossDomainMessageSchema = z.object({
  id: z.string(),
  opStackChain: OpStackChainSchema,
  status: StatusSchema,
  msgHash: HexSchema,
  sourceChainId: IndexedChainIdSchema,
  targetChainId: IndexedChainIdSchema,
  target: AddressSchema,
  sender: AddressSchema,
  message: HexSchema,
  messageNonce: z.coerce.bigint(),
  gasLimit: z.coerce.bigint(),
  value: z.coerce.bigint(),
  lastUpdatedAtBlockTimestamp: z.number(),
  transactionHashes: z.array(HexSchema),
  sentMessageEvent: SentMessageEventSchema,
  sentMessageExtension1Event: SentMessageExtension1EventSchema,
  relayedMessageEvent: RelayedMessageEventSchema.nullable(),
  failedRelayedMessageEvent: RelayedMessageEventSchema.nullable(),
})

export type CrossDomainMessage = z.infer<typeof CrossDomainMessageSchema>
