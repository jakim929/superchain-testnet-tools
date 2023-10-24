import { Hex } from 'viem'

export const truncateHash = (address: Hex) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
