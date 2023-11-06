import { useCrossDomainMessagesForTransactionHash } from '@/lib/getCrossDomainMessagesForTransactionHash'

export const MessagePasserPage = () => {
  const result = useCrossDomainMessagesForTransactionHash(
    '0x17b8b82bacec8b6f522f21c96d81a046c01dd1c25e41951502dcf3db5b1b8a93',
  )

  console.log(result)
  return <div>Coming soon</div>
}
