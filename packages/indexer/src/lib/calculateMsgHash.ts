import {
  Address,
  Hex,
  concat,
  encodeAbiParameters,
  getFunctionSelector,
  keccak256,
} from 'viem'

export const calculateMsgHash = ({
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
