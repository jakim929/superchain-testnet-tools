import { wagmiConfig } from '@/lib/wagmi'
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  )
}
