import { useCrossDomainMessagesForTransactionHash } from '@/lib/getCrossDomainMessagesForTransactionHash'
import { useEffect } from 'react'
import {
  Address,
  Hex,
  concat,
  encodeAbiParameters,
  getFunctionSelector,
  keccak256,
  parseEther,
  toHex,
} from 'viem'

// TODO: refactor in to common-ts
const calculateMsgHash = ({
  nonce,
  sender,
  target,
  value,
  gasLimit,
  data,
}: {
  nonce: bigint
  sender: Address
  target: Address
  value: bigint
  gasLimit: bigint
  data: Hex
}) => {
  const functionSignature = getFunctionSelector(
    'relayMessage(uint256,address,address,uint256,uint256,bytes)',
  )

  const result = encodeAbiParameters(
    [
      {
        type: 'uint256',
      },
      {
        type: 'address',
      },
      {
        type: 'address',
      },
      {
        type: 'uint256',
      },
      {
        type: 'uint256',
      },
      {
        type: 'bytes',
      },
    ],
    [nonce, sender, target, value, gasLimit, data],
  )

  const encodedWithSignature = concat([functionSignature, result])
  return keccak256(encodedWithSignature)
}

export const MessagePasserPage = () => {
  const result = useCrossDomainMessagesForTransactionHash(
    '0x17b8b82bacec8b6f522f21c96d81a046c01dd1c25e41951502dcf3db5b1b8a93',
  )

  console.log(result)
  return <div>Coming soon</div>
}
