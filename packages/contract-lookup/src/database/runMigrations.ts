import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { envVars } from '@/envVars'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

export const runMigrations = async () => {
  const client = new Client({
    connectionString: envVars.POSTGRES_URL,
  })
  await client.connect()
  const db = drizzle(client)

  await migrate(db, {
    migrationsFolder: 'migrations',
  })
}
