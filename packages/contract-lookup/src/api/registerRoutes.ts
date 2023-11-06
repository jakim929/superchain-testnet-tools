import {
  SupportedChainId,
  fetchContractMetadata,
  supportedChainIdSet,
} from '@/metadataFetcher/fetchContractMetadata'
import { AddressSchema } from '@superchain-testnet-tools/common-ts'
import { Queue } from 'bullmq'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { FastifyInstance } from 'fastify'
import { Address } from 'viem'
import { z } from 'zod'

const ContractMetadataParamsSchema = z.object({
  chainId: z.coerce
    .number()
    .refine((_chainId) => supportedChainIdSet.has(_chainId as any))
    .transform((x) => x as SupportedChainId),
  address: AddressSchema,
})

export const registerRoutes = (
  fastify: FastifyInstance,
  db: NodePgDatabase,
  jobQueue: Queue,
) => {
  fastify.get<{
    Params: {
      chainId: number
      address: Address
    }
  }>('/contract-metadata/:chainId/:address', async (request, reply) => {
    const parseResult = ContractMetadataParamsSchema.safeParse(request.params)
    if (!parseResult.success) {
      reply.code(400).send()
      return
    }
    const { chainId, address } = parseResult.data

    const fetchResult = await fetchContractMetadata(chainId, address).catch(
      (err) => {
        console.error(err)
        reply.code(500).send()
      },
    )

    reply.code(200).send(fetchResult)
  })
}
