import {
  OpStackChainL1Contracts,
  OpStackChainL2PredeployContracts,
} from './OpStackChainContracts'
import { Chain } from 'viem'

export type OpStackChain = {
  readonly l1Chain: Chain
  readonly l2Chain: Chain
  readonly l1Contracts: OpStackChainL1Contracts
  readonly l2Contracts: OpStackChainL2PredeployContracts
}
