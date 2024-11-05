import '@rainbow-me/rainbowkit/styles.css'

import { envVars } from '@/envVars'
import { supportedChains } from '@/supportedChains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'Superchain Testnet Tools',
  projectId: envVars.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: supportedChains,
})
