import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { and, eq, or } from 'drizzle-orm'
import { Abi as AbiSchema } from 'abitype/zod'

import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address } from 'viem/accounts'

import { Abi } from 'viem'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { z } from 'zod'

export const contractMetadataSourceEnum = pgEnum('contractMetadataSource', [
  'blockscout',
  'etherscan',
])

export const contractMetadatas = pgTable(
  'contractMetadatas',
  {
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chainId').notNull(),
    address: varchar('address').$type<Address>().notNull(),
    source: contractMetadataSourceEnum('source').notNull(),
    name: varchar('name').notNull(),
    abi: jsonb('abi').$type<z.infer<typeof AbiSchema>>().notNull(),
    sourceCode: varchar('sourceCode'),
    implementationAddress: varchar('implementationAddress').$type<Address>(),
  },
  (table) => {
    return {
      chainIdAddressIdx: uniqueIndex().on(table.chainId, table.address),
    }
  },
)

export type ContractMetadataSelect = InferSelectModel<typeof contractMetadatas>
export type ContractMetadataInsert = InferInsertModel<typeof contractMetadatas>
