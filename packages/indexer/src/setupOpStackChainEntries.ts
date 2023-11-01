import { OpStackChain as OpStackChainModel, ponder } from '@/generated'
import { Model } from '@ponder/core'
import { OpStackChain } from '@superchain-testnet-tools/chains'
import { indexedOpStackChains } from '@superchain-testnet-tools/indexed-chains'

const createOpStackChainEntry = async (
  model: Model<OpStackChainModel>,
  opStackChain: OpStackChain,
) => {
  return await model.create({
    id: opStackChain.l2Chain.id,
    data: {
      l1ChainId: opStackChain.l1Chain.id,
      l2ChainId: opStackChain.l2Chain.id,
    },
  })
}

// this thing only runs once. so when adding a new chain, run a migration
ponder.on('setup', async ({ context }) => {
  const { entities } = context
  console.log('Setting up...')

  const { OpStackChain } = entities

  await Promise.all([
    indexedOpStackChains.map(async (opStackChain) =>
      createOpStackChainEntry(OpStackChain, opStackChain),
    ),
  ])
})
