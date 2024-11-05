import { BridgeCard } from '@/components/BridgeCard'
import { Chain, sepolia } from 'viem/chains'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAccount, useSwitchChain } from 'wagmi'

const supportedSourceChains = [sepolia]

const getTabKey = (currentChain?: Chain) => {
  if (!currentChain) return supportedSourceChains[0].id.toString()

  if (supportedSourceChains.some((chain) => chain.id === currentChain.id)) {
    return currentChain.id.toString()
  }

  return supportedSourceChains[0].id.toString()
}

export const BridgePage = () => {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()
  return (
    <div className="flex justify-center ">
      <Tabs
        defaultValue={getTabKey()}
        value={getTabKey(chain)}
        className="w-[400px]"
      >
        <TabsList className="w-full flex">
          {supportedSourceChains.map((chain) => (
            <TabsTrigger
              onClick={() => switchChain?.({ chainId: chain.id })}
              className="flex-1"
              key={chain.name}
              value={chain.id.toString()}
            >
              {chain.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {supportedSourceChains.map((chain) => {
          return (
            <TabsContent key={chain.name} value={chain.id.toString()}>
              <BridgeCard l1Chain={chain} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
