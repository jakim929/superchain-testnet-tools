import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import { Queue } from 'bullmq'
import Fastify from 'fastify'

export const initializeApiServer = async (jobQueue: Queue) => {
  const fastify = Fastify({
    logger: true,
  })

  const serverAdapter = new FastifyAdapter()

  createBullBoard({
    queues: [new BullMQAdapter(jobQueue)],
    serverAdapter,
  })

  serverAdapter.setBasePath('/admin/job-queue')
  fastify.register(serverAdapter.registerPlugin(), { basePath: '/admin/job-queue' })

  return fastify
}
