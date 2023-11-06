import { Hex } from 'viem'

import type { Address } from 'viem'
import { z } from 'zod'

export const HexSchema = z
  .string()
  .refine((hex) => hex.startsWith('0x'))
  .transform((x) => x as Hex)

export const AddressSchema = HexSchema.refine(
  (hex) => hex.length === 42,
).transform((x) => x as Address)
