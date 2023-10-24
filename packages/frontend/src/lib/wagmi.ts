import { envVars } from '@/lib/envVars'
import { getDefaultConnectors } from 'connectkit'
import { Chain, configureChains, createConfig } from 'wagmi'
import {
  base,
  baseGoerli,
  foundry,
  optimism,
  optimismGoerli,
} from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const chainById: Record<number, Chain> = {
  [optimism.id]: optimism,
  [optimismGoerli.id]: optimismGoerli,
  [base.id]: base,
  [baseGoerli.id]: baseGoerli,
  [foundry.id]: foundry,
}

const chain = chainById[envVars.VITE_CHAIN_ID]

const { chains, publicClient } = configureChains(
  [chain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: envVars.VITE_JSON_RPC_HTTP_URL,
      }),
    }),
  ],
)

const connectors = getDefaultConnectors({
  chains: chains,
  app: {
    name: 'DApp Starter',
  },
  walletConnectProjectId: envVars.VITE_WALLET_CONNECT_PROJECT_ID,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export { chains }
