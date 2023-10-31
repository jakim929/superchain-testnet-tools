import { OpStackChain, opStackChains } from '@superchain-testnet-tools/chains'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useSwitchNetwork } from 'wagmi'

const ChainRow = ({
  chain,
}: {
  chain: OpStackChain
}) => {
  const { l1Chain, l2Chain } = chain

  const { switchNetwork } = useSwitchNetwork()

  return (
    <TableRow>
      <TableCell className="font-medium">
        <a
          href={l2Chain.blockExplorers!.default.url}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: 'link' }), ' text-blue-600')}
        >
          {chain.l2Chain.name}
        </a>
      </TableCell>
      <TableCell>{l2Chain.id}</TableCell>
      <TableCell>
        {l1Chain.name} ({l1Chain.id})
      </TableCell>
      <TableCell className="inline-flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => switchNetwork?.(l2Chain.id)}
        >
          Add network
        </Button>
      </TableCell>
    </TableRow>
  )
}

export const ChainsPage = () => {
  return (
    <div className="flex justify-center">
      <Card className="w-[700px]">
        <CardHeader>
          <CardTitle>OP Stack Testnets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">
                  <div className="px-4">Name</div>
                </TableHead>
                <TableHead>Chain ID</TableHead>
                <TableHead>Source chain</TableHead>
                <TableHead>{''}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opStackChains.map((chain) => (
                <ChainRow key={chain.l2Chain.id} chain={chain} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
