import { envVars } from '@/envVars'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export const connectToDatabase = () => {
  const pool = new Pool({
    connectionString: envVars.POSTGRES_URL,
  })
  return drizzle(pool)
}
