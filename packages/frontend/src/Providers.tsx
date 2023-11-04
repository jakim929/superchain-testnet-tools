import { createWagmiConfig } from '@/lib/wagmi'
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const wagmiConfig = createWagmiConfig(queryClient)

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}
