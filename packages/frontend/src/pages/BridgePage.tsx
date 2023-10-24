import { BridgeCard } from '@/components/BridgeCard'
import { goerli, sepolia } from 'viem/chains'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNetwork, useSwitchNetwork } from 'wagmi'

const supportedSourceChains = [sepolia, goerli]

export const BridgePage = () => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  return (
    <div className="flex justify-center ">
      <Tabs
        defaultValue={
          supportedSourceChains[0].id.toString()
        }
        value={chain?.id.toString()}
        className="w-[400px]"
      >
        <TabsList className="w-full flex">
          {supportedSourceChains.map((chain) => (
            <TabsTrigger
              onClick={() => switchNetwork?.(chain.id)}
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
