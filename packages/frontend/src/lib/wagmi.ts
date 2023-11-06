import { envVars } from '@/envVars'
import { getDefaultConnectors } from 'connectkit'
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { opStackChains } from '@superchain-testnet-tools/chains'
import { QueryClient } from '@tanstack/react-query'
import { supportedChains } from '@/supportedChains'

// const chainById: Record<number, Chain> = {
//   [optimismGoerli.id]: optimismGoerli,
//   [baseGoerli.id]: baseGoerli,
//   [foundry.id]: foundry,
// }

const { chains, publicClient } = configureChains(supportedChains, [
  publicProvider(),
])

const connectors = getDefaultConnectors({
  chains: chains,
  app: {
    name: 'Superchain Testnet Tools',
  },
  walletConnectProjectId: envVars.VITE_WALLET_CONNECT_PROJECT_ID,
})

export const createWagmiConfig = (queryClient: QueryClient) => {
  return createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    queryClient: queryClient as any,
  })
}

export { chains }
