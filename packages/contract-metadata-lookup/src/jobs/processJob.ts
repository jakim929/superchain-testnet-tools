import { TEST_CONSOLE_LOG, testConsoleLog } from '@/jobs/testConsoleLog'
import { Job } from 'bullmq'

export const processJob = async ({
  job,
}: {
  job: Job
}) => {
  const { name, data } = job

  if (name === TEST_CONSOLE_LOG) {
    return await testConsoleLog(data)
  } else {
    throw new Error(`invalid job name ${name}`)
  }
}
