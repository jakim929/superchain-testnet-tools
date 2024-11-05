import { Button } from '@/components/ui/button'
import { OpStackChain, opStackChains } from '@superchain-testnet-tools/chains'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { produce } from 'immer'
import { Input } from '@/components/ui/input'
import {
  Address,
  Chain,
  Hex,
  encodeFunctionData,
  formatEther,
  parseEther,
  toHex,
} from 'viem'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  useAccount,
  useBalance,
  useWriteContract,
  useSimulateContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { L1CrossDomainMessengerAbi } from '@/constants/L1CrossDomainMessengerAbi'
import { Multicall3Abi } from '@/constants/Multicall3Abi'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { truncateHash } from '@/lib/truncateHash'
import { ArrowRight } from 'lucide-react'

const truncateDecimal = (
  decimalString: string,
  maxLengthAfterDecimal = 5,
): string => {
  // Check if there's a decimal point
  if (decimalString.includes('.')) {
    const parts = decimalString.split('.')
    const integerPart = parts[0]
    return `${integerPart}.${parts[1].substring(0, maxLengthAfterDecimal)}`
  }
  return decimalString // Return as it is if no decimal point
}

const useFormattedBalance = (chainId: number) => {
  const { address } = useAccount()
  const { data } = useBalance({
    address: address!,
    chainId: chainId,
    query: {
      enabled: !!address,
    },
  })

  if (!address || !data) {
    return undefined
  }

  return `${truncateDecimal(data.formatted)} ${data.symbol}`
}

const NetworkSwitch = ({
  opStackChain,
  onChange,
  isSelected,
}: {
  opStackChain: OpStackChain
  onChange: (isSelected: boolean) => void
  isSelected: boolean
}) => {
  const { name, id } = opStackChain.l2Chain
  const formattedBalance = useFormattedBalance(id)
  return (
    <div className="w-full flex space-x-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2">
      <Switch
        id={`${id}-network-switch`}
        onCheckedChange={(checked) => {
          onChange(checked)
        }}
        checked={isSelected}
        className="self-center data-[state=checked]:bg-primary"
      />
      <Label
        htmlFor={`${id}-network-switch`}
        className="w-full cursor-pointer flex items-center justify-between select-none py-3"
      >
        <div className="flex items-center gap-2">{name}</div>
        {formattedBalance && (
          <div className="text-muted-foreground text-sm">
            {formattedBalance}
          </div>
        )}
      </Label>
    </div>
  )
}

const useNetworkSelection = (opStackChains: OpStackChain[]) => {
  const [isSelectedByChainId, setIsSelectedByChainId] = useState<
    Record<number, boolean>
  >(
    opStackChains.reduce<Record<number, boolean>>((acc, chain) => {
      acc[chain.l2Chain.id] = false
      return acc
    }, {}),
  )

  return {
    allChains: opStackChains,
    selectedChains: opStackChains.filter(({ l2Chain }) => {
      return !!isSelectedByChainId[l2Chain.id]
    }),
    setIsSelected: (chainId: number, isSelected: boolean) => {
      setIsSelectedByChainId((prevVal) =>
        produce(prevVal, (draft) => {
          draft[chainId] = isSelected
        }),
      )
    },
    isSelectedByChainId,
  }
}

const NetworkSwitches = ({
  chains,
  isSelectedByChainId,
  setIsSelected,
}: {
  chains: OpStackChain[]
  isSelectedByChainId: Record<number, boolean>
  setIsSelected: (chainId: number, isSelected: boolean) => void
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="network-switch-input" className="flex justify-between">
        <div>Networks</div>
        <div>Current balance</div>
      </Label>
      <div id="network-switch-input" className="flex flex-col">
        {chains.map((chain) => {
          return (
            <NetworkSwitch
              key={chain.l2Chain.id}
              opStackChain={chain}
              isSelected={isSelectedByChainId[chain.l2Chain.id]}
              onChange={(isChecked) => {
                setIsSelected(chain.l2Chain.id, isChecked)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

const AmountQuickInputButton = ({
  amount,
  isSelected,
  onClick,
}: {
  isSelected: boolean
  onClick: () => void
  amount: bigint
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        'flex-1 transition-all',
        isSelected
          ? 'border-primary/90 bg-primary text-primary-foreground hover:bg-primary/90'
          : 'hover:border-primary/50',
      )}
    >
      {formatEther(amount)} ETH
    </Button>
  )
}

const QUICK_INPUT_AMOUNTS = [
  parseEther('10'),
  parseEther('1'),
  parseEther('0.1'),
  parseEther('0.01'),
]

const AmountInput = ({
  amount,
  setAmount,
}: {
  amount: bigint
  setAmount: (amount: bigint) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="bridge-amount-input">Amount</Label>
      <Input
        id="bridge-amount-input"
        type="number"
        placeholder="0.0"
        value={formatEther(amount)}
        onChange={(e) => setAmount(parseEther(e.target.value))}
      />
      <div className="flex gap-2">
        {QUICK_INPUT_AMOUNTS.map((quickInputAmount) => {
          return (
            <AmountQuickInputButton
              key={`quick-input-${quickInputAmount}`}
              amount={quickInputAmount}
              isSelected={quickInputAmount === amount}
              onClick={() => setAmount(quickInputAmount)}
            />
          )
        })}
      </div>
    </div>
  )
}

const Preview = ({
  selectedChains,
  amount,
}: {
  selectedChains: OpStackChain[]
  amount: bigint
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Total amount</div>
        <div className="font-medium text-lg">
          {formatEther(BigInt(selectedChains.length) * amount)} ETH
        </div>
      </div>
      {selectedChains.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">Bridging to:</div>
          <div className="flex flex-wrap gap-2">
            {selectedChains.map((chain) => (
              <div
                key={chain.l2Chain.id}
                className="bg-background px-3 py-1 rounded-full text-sm border"
              >
                {chain.l2Chain.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const getBridgeFundsFunctionData = (address?: Address) => {
  if (!address) {
    return null
  }
  return encodeFunctionData({
    abi: L1CrossDomainMessengerAbi,
    functionName: 'sendMessage',
    args: [address, toHex(''), 1000000],
  })
}

const getBlockExplorerLink = (chain: Chain, transactionHash: Hex) => {
  const baseUrl = chain.blockExplorers!.default.url
  return `${baseUrl}/tx/${transactionHash}`
}

const SwitchToChainButton = ({
  chain,
}: {
  chain: Chain
}) => {
  const { switchChain, isPending } = useSwitchChain()
  return (
    <Button
      className="w-full"
      disabled={!switchChain || isPending}
      onClick={() => {
        switchChain?.({ chainId: chain.id })
      }}
    >
      Switch network to {chain.name}
    </Button>
  )
}

export const BridgeCard = ({ l1Chain }: { l1Chain: Chain }) => {
  const chainId = l1Chain.id
  const chains = opStackChains.filter(
    (opStackChain) => opStackChain.l1Chain.id === chainId,
  )

  const formattedL1Balance = useFormattedBalance(chainId)
  const { chain } = useAccount()

  const { toast } = useToast()

  const { selectedChains, allChains, setIsSelected, isSelectedByChainId } =
    useNetworkSelection(chains)

  const [amount, setAmount] = useState<bigint>(0n)

  const { address } = useAccount()

  const { data: simulatedData, error } = useSimulateContract({
    abi: Multicall3Abi,
    functionName: 'aggregate3Value',
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    args: [
      // @ts-ignore
      [
        ...selectedChains.map(({ l1Contracts }) => {
          return {
            target: l1Contracts.l1CrossDomainMessenger.address,
            allowFailure: false,
            callData: getBridgeFundsFunctionData(address!),
            value: amount,
          }
        }),
      ],
    ],
    value: amount * BigInt(selectedChains.length),
    // enabled: !!address && amount > 0n && opStackChains.length > 0,
  })

  const {
    writeContract,
    isPending,
    data: response,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash: Hex) => {
        toast({
          title: 'L1 transaction sent',
          description: `${truncateHash(hash)}`,
          action: (
            <ToastAction
              altText="View on explorer"
              onClick={() => {
                window.open(getBlockExplorerLink(l1Chain, hash), '_blank')
              }}
            >
              View on explorer
            </ToastAction>
          ),
        })
      },
    },
  })

  const { isLoading: isConfirmationLoading } = useWaitForTransactionReceipt({
    hash: response,
    confirmations: 5,
  })

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {l1Chain.name}
        </CardTitle>
        {formattedL1Balance && (
          <CardDescription className="flex items-center gap-2">
            Balance: <span className="font-medium">{formattedL1Balance}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <NetworkSwitches
          chains={allChains}
          isSelectedByChainId={isSelectedByChainId}
          setIsSelected={setIsSelected}
        />
        <AmountInput amount={amount} setAmount={setAmount} />
        <Separator className="" />
        <Preview selectedChains={selectedChains} amount={amount} />
      </CardContent>
      <CardFooter className="flex gap-2">
        {chain?.id === l1Chain.id ? (
          <Button
            className="w-full gap-2"
            disabled={
              isPending ||
              !writeContract ||
              isConfirmationLoading ||
              !simulatedData?.request
            }
            onClick={() => {
              writeContract(simulatedData!.request)
            }}
          >
            Bridge <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <SwitchToChainButton chain={l1Chain} />
        )}
      </CardFooter>
    </Card>
  )
}
