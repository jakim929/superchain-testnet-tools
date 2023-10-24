import { ChainContract } from 'viem'

export type OpStackChainL1ContractName =
  | 'l1CrossDomainMessenger'
  | 'l1StandardBridge'

export type OpStackChainL1Contracts = Record<
  OpStackChainL1ContractName,
  ChainContract
>

export type OpStackChainL2PredeployContractName =
  | 'l2CrossDomainMessenger'
  | 'l2ToL1MessagePasser'

export type OpStackChainL2PredeployContracts = Record<
  OpStackChainL2PredeployContractName,
  ChainContract
>
