import { envVars } from '@/envVars'
import { configureChains, createConfig } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'
import { supportedChains } from '@/supportedChains'
import { publicProvider } from 'wagmi/providers/public'

import { getDefaultConnectors } from 'connectkit'

const { chains, publicClient } = configureChains(supportedChains, [
  publicProvider(),
])

const connectors = getDefaultConnectors({
  chains: supportedChains,
  app: {
    name: 'Superchain Testnet Tools',
  },
  walletConnectProjectId: envVars.VITE_WALLET_CONNECT_PROJECT_ID,
})

export const createWagmiConfig = (queryClient: QueryClient) => {
  return createConfig({
    autoConnect: true,
    connectors,
    queryClient: queryClient as any,
    publicClient: publicClient,
  })
}

export { chains }
