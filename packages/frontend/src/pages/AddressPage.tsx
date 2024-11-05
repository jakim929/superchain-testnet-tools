import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Copy, Code2, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Chain } from 'wagmi/chains'
import { opStackChains } from '@superchain-testnet-tools/chains'
import { useBytecode } from 'wagmi'
import { Address } from 'viem'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const AddressLink = ({
  address,
  chain,
}: { address: Address; chain: Chain }) => {
  const explorerBaseUrl = chain.blockExplorers?.default.url
  const explorerUrl = `${explorerBaseUrl}/address/${address}`
  const { data, isLoading } = useBytecode({
    address: address,
    chainId: chain.id,
  })
  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-lg hover:bg-muted/80 transition-all group"
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {chain.name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{chain.name}</p>
        <p className="text-sm text-muted-foreground">View on explorer</p>
      </div>
      {isLoading ? (
        <Code2 className="h-4 w-4 animate-spin" />
      ) : (
        data !== undefined && (
          <Badge variant="outline" className="ml-auto">
            {data && data !== '0x' ? 'Contract' : 'EOA'}
          </Badge>
        )
      )}
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}

export const AddressPage = () => {
  const { address } = useParams()
  if (!address) {
    return <div>No address provided</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-[800px] mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Address Details
          </CardTitle>
          <p className="text-muted-foreground">
            View details and explorer links for this address
          </p>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="relative">
            <div className="flex items-center justify-between p-6 bg-muted rounded-lg border shadow-sm">
              <span className="font-mono break-all text-sm">{address}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        if (address) {
                          navigator.clipboard.writeText(address)
                        }
                      }}
                      className="ml-2 p-2 hover:bg-background rounded-md transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Block Explorer Links
            </h3>
            <div className="grid gap-3 bg-card rounded-xl border shadow-sm p-3">
              {opStackChains.map((opStackChain) => (
                <AddressLink
                  key={opStackChain.l2Chain.name}
                  address={address as Address}
                  chain={opStackChain.l2Chain}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
