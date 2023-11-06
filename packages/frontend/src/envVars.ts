import { Address } from 'viem'
import { z } from 'zod'

const envVarSchema = z.object({
  VITE_WALLET_CONNECT_PROJECT_ID: z.string().transform((x) => x as Address),
  VITE_CROSS_DOMAIN_MESSENGER_INDEXER_URL: z.string(),
  VITE_CONTRACT_LOOKUP_SERVICE_URL: z.string(),
})

export const envVars = envVarSchema.parse(import.meta.env)
