import { envVars } from '@/envVars'
import { initializeApiServer } from '@/initializeApiServer'
import { initializeJobQueue } from '@/initializeJobQueue'
import { TEST_CONSOLE_LOG } from '@/jobs/testConsoleLog'
import { sleep } from '@/lib/sleep'

import { Queue } from 'bullmq'
import { FastifyInstance } from 'fastify'

export class ContractMetadataLookupService {
  constructor(
    private readonly jobQueue: Queue,
    private readonly apiServer: FastifyInstance,
  ) {}

  static async init() {
    const jobQueue = initializeJobQueue()
    const apiServer = await initializeApiServer(jobQueue)

    return new ContractMetadataLookupService(jobQueue, apiServer)
  }

  async loop() {
    console.log("Looping")
    this.jobQueue.add(TEST_CONSOLE_LOG, {
      testDate: Date.now(),
    })
  }

  async run() {
    await this.apiServer.listen({ port: 3000 })

    while (true) {
      await this.loop()
      await sleep(envVars.LOOP_INTERVAL_MS)
    }
  }
}
