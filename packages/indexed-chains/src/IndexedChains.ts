import { indexedOpStackChains } from './IndexedOpStackChains'

const indexedChainsWithDuplicates = indexedOpStackChains.flatMap(
  (opStackChain) => {
    return [opStackChain.l1Chain, opStackChain.l2Chain]
  },
)

export type IndexedChain = typeof indexedChainsWithDuplicates[number]
export type IndexedChainId = IndexedChain['id']

export const indexedChainById = indexedChainsWithDuplicates.reduce<
  Record<IndexedChainId, IndexedChain>
>((acc, chain) => {
  return {
    ...acc,
    [chain.id]: chain,
  }
}, {} as any)

export const indexedChains = Object.values(indexedChainById)
