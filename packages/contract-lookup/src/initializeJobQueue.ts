import { JOB_QUEUE } from '@/constants/queues'
import { envVars } from '@/envVars'
import { Queue } from 'bullmq'

export const initializeJobQueue = () => {
  return new Queue(JOB_QUEUE, {
    connection: {
      host: envVars.REDIS_HOST,
      port: envVars.REDIS_PORT,
      username: envVars.REDIS_USERNAME,
      password: envVars.REDIS_PASSWORD,
    },
  })
}
