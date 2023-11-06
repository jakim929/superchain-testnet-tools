import type { Config } from 'drizzle-kit'
import { envVars } from './src/envVars'

export default {
  schema: './src/models/*',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: envVars.POSTGRES_URL,
  },
} satisfies Config
