import { envVars } from '@/lib/envVars'
import { getDefaultConnectors } from 'connectkit'
import { Chain, configureChains, createConfig, sepolia } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { baseGoerli, foundry, goerli, optimismGoerli } from 'wagmi/chains'

const chainById: Record<number, Chain> = {
  [optimismGoerli.id]: optimismGoerli,
  [baseGoerli.id]: baseGoerli,
  [foundry.id]: foundry,
}

const { chains, publicClient } = configureChains(
  [sepolia, goerli],
  [publicProvider()],
)

const connectors = getDefaultConnectors({
  chains: chains,
  app: {
    name: 'Superchain Testnet Tools',
  },
  walletConnectProjectId: envVars.VITE_WALLET_CONNECT_PROJECT_ID,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export { chains }
