import { registerRoutes } from '@/api/registerRoutes'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import { Queue } from 'bullmq'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import Fastify from 'fastify'
import cors from '@fastify/cors'

export const initializeApiServer = async (
  db: NodePgDatabase,
  jobQueue: Queue,
) => {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: [
      /^https?:\/\/([A-Za-z0-9\-\_\.]*).superchain.tools/,
      /^http:\/\/localhost:5173/,
      /^http:\/\/127\.0\.0\.1:5173/,
    ],
  })

  // const serverAdapter = new FastifyAdapter()

  // createBullBoard({
  //   queues: [new BullMQAdapter(jobQueue)],
  //   serverAdapter,
  // })

  // serverAdapter.setBasePath('/admin/job-queue')
  // fastify.register(serverAdapter.registerPlugin(), { basePath: '/admin/job-queue' })

  registerRoutes(fastify, db, jobQueue)

  return fastify
}
