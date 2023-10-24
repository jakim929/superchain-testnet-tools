import { Address, Hex } from 'viem'
import { z } from 'zod'

const envVarSchema = z.object({
  VITE_CHAIN_ID: z.coerce.number(),
  VITE_JSON_RPC_HTTP_URL: z.string(),
  VITE_WALLET_CONNECT_PROJECT_ID: z.string().transform((x) => x as Address),
})

export const envVars = envVarSchema.parse(import.meta.env)
