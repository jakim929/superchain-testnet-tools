export const getCrossDomainMessageKey = ({
  msgHash,
  sourceChainId,
  targetChainId,
}: {
  msgHash: string
  sourceChainId: number
  targetChainId: number
}) => {
  return `${sourceChainId}_${targetChainId}_${msgHash}`
}

export const getSentMessageEventKey = ({
  logId,
  sourceChainId,
  targetChainId,
}: {
  logId: string
  sourceChainId: number
  targetChainId: number
}) => {
  return `${sourceChainId}_${targetChainId}_${logId}`
}

export const getRelayedMessageEventKey = ({
  logId,
  sourceChainId,
  targetChainId,
}: {
  logId: string
  sourceChainId: number
  targetChainId: number
}) => {
  return `${sourceChainId}_${targetChainId}_${logId}`
}

export const getSentMessageExtension1EventKey = ({
  logId,
  sourceChainId,
  targetChainId,
}: {
  logId: string
  sourceChainId: number
  targetChainId: number
}) => {
  return `${sourceChainId}_${targetChainId}_${logId}`
}

export const getFailedRelayedMessageEventKey = ({
  logId,
  sourceChainId,
  targetChainId,
}: {
  logId: string
  sourceChainId: number
  targetChainId: number
}) => {
  return `${sourceChainId}_${targetChainId}_${logId}`
}
