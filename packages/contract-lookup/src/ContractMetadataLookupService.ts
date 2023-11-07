import { connectToDatabase } from '@/database/connectToDatabase'
import { runMigrations } from '@/database/runMigrations'
import { envVars } from '@/envVars'
import { initializeApiServer } from '@/initializeApiServer'
import { initializeJobQueue } from '@/initializeJobQueue'
import { TEST_CONSOLE_LOG } from '@/jobs/testConsoleLog'
import { sleep } from '@/lib/sleep'

import { Queue } from 'bullmq'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { FastifyInstance } from 'fastify'

export class ContractMetadataLookupService {
  constructor(
    private readonly db: NodePgDatabase,
    private readonly jobQueue: Queue,
    private readonly apiServer: FastifyInstance,
  ) {}

  static async init() {
    console.log('[ContractMetadataLookupService] Running migrations...')
    await runMigrations()

    console.log('[ContractMetadataLookupService] Connecting to database...')
    const db = connectToDatabase()

    console.log('[ContractMetadataLookupService] Initializing job queue...')

    const jobQueue = initializeJobQueue()

    console.log('[ContractMetadataLookupService] Initializing api server...')

    const apiServer = await initializeApiServer(db, jobQueue)

    return new ContractMetadataLookupService(db, jobQueue, apiServer)
  }

  async loop() {
    console.log('[ContractMetadataLookupService] Looping...')
    this.jobQueue.add(TEST_CONSOLE_LOG, {
      testDate: Date.now(),
    })
  }

  async run() {
    await this.apiServer.listen({ port: envVars.PORT })

    while (true) {
      await this.loop()
      await sleep(envVars.LOOP_INTERVAL_MS)
    }
  }
}
