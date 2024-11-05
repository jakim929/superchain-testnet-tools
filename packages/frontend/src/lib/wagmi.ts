import '@rainbow-me/rainbowkit/styles.css'

import { envVars } from '@/envVars'
import { supportedChains } from '@/supportedChains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

function removeDups<T>(names: T[], keyFn: (item: T) => any = (item) => item): T[] {
  let unique: Map<any, T> = new Map();
  names.forEach((item) => {
    const key = keyFn(item);
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  });
  return Array.from(unique.values());
}

export const config = getDefaultConfig({
  appName: 'Superchain Testnet Tools',
  projectId: envVars.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: removeDups(supportedChains, (chain) => chain.id),
})
