import 'dotenv/config'
import { z } from 'zod'

const envVarSchema = z.object({
  LOOP_INTERVAL_MS: z.coerce.number(),
  ETHEREUM_ETHERSCAN_API_KEY: z.string(),
  BASE_ETHERSCAN_API_KEY: z.string(),
  OPTIMISM_ETHERSCAN_API_KEY: z.string(),
  POSTGRES_URL: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_HOST: z.string(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
})

export const envVars = envVarSchema.parse(process.env)
