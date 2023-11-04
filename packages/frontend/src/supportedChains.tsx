import { opStackChains } from '@superchain-testnet-tools/chains'

export const supportedChains = [
  ...opStackChains.map((chain) => chain.l1Chain),
  ...opStackChains.map((chain) => chain.l2Chain),
]

type SupportedChain = typeof supportedChains[number]
type SupportedChainId = SupportedChain['id']

export const supportedChainById = supportedChains.reduce<
  Record<SupportedChainId, SupportedChain>
>((acc, chain) => {
  return {
    ...acc,
    [chain.id]: chain,
  }
}, {} as any)
