import { wagmiConfig } from '@/lib/wagmi'
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider
        customTheme={{
          '--ck-font-family':
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          '--ck-connectbutton-font-weight': 'bold',
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
