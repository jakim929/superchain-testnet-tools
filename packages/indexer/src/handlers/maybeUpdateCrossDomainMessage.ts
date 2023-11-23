import { CrossDomainMessage as CrossDomainMessageSchema } from '@/generated'
import { Model } from '@ponder/core'

export const maybeUpdateCrossDomainMessage = async (
  CrossDomainMessage: Model<CrossDomainMessageSchema>,
  crossDomainMessageKey: string,
  updater: (
    crossDomainMessage: CrossDomainMessageSchema,
  ) => Partial<CrossDomainMessageSchema>,
) => {
  const crossDomainMessage = await CrossDomainMessage.findUnique({
    id: crossDomainMessageKey,
  })

  if (!crossDomainMessage) {
    // If the source transaction hasn't been indexed yet, do nothing
    // When the source transaction is indexed, it will update the crossDomainMessage with the target chain transaction as well
    return
  }

  await CrossDomainMessage.update({
    id: crossDomainMessageKey,
    data: ({ current }) => updater(current),
  })
}
