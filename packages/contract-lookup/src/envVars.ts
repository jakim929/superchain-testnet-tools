import 'dotenv/config'
import { z } from 'zod'

const envVarSchema = z.object({
  LOOP_INTERVAL_MS: z.coerce.number(),
  REDIS_PORT: z.coerce.number(),
  REDIS_HOST: z.string(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
})

export const envVars = envVarSchema.parse(process.env)
