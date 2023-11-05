import { ContractMetadataLookupService } from '@/ContractMetadataLookupService'

const run = async () => {
  const service = await ContractMetadataLookupService.init().catch((e) => {
    console.error('ContractMetadataLookup service failed to initialize', e)
    process.exit(1)
  })
  await service.run().catch((e) => {
    console.error('ContractMetadataLookup service failed to run', e)
    process.exit(1)
  })
}

run()
