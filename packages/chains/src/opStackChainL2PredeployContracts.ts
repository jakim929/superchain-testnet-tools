import { OpStackChainL2PredeployContracts } from './types/OpStackChainContracts'

export const opStackChainL2PredeployContracts = {
  l2CrossDomainMessenger: {
    address: '0x4200000000000000000000000000000000000007',
    blockCreated: 0,
  },

  l2ToL1MessagePasser: {
    address: '0x4200000000000000000000000000000000000016',
    blockCreated: 0,
  },
} as const satisfies OpStackChainL2PredeployContracts
