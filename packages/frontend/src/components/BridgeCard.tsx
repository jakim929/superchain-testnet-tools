import { opStackChains } from '@/chains/opStackChains'
import { OpStackChain } from '@/chains/types/OpStackChain'
import { Button } from '@/components/ui/button'
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
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { L1CrossDomainMessengerAbi } from '@/constants/L1CrossDomainMessengerAbi'
import { Multicall3Abi } from '@/constants/Multicall3Abi'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { truncateHash } from '@/lib/truncateHash'

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
    enabled: !!address,
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
    <div className="w-full flex space-x-2 cursor-pointer">
      <Switch
        id={`${id}-network-switch`}
        onCheckedChange={(checked) => {
          onChange(checked)
        }}
        checked={isSelected}
        className="self-center"
      />
      <Label
        htmlFor={`${id}-network-switch`}
        className="w-full cursor-pointer flex items-center justify-between select-none py-3"
      >
        <div>{name}</div>
        {formattedBalance && <div>{formattedBalance}</div>}
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
      <Label htmlFor="network-switch-input">Networks</Label>
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
        'flex-1',
        isSelected &&
          'border-primary/90 bg-primary/90 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="font-semibold">Total amount</div>
        <div>{formatEther(BigInt(selectedChains.length) * amount)} ETH</div>
      </div>
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

const useBridgeWrite = (
  opStackChains: OpStackChain[],
  amount: bigint,
  onSuccess: (hash: Hex) => void,
) => {
  const { address } = useAccount()

  const { config } = usePrepareContractWrite({
    abi: Multicall3Abi,
    functionName: 'aggregate3Value',
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    args: [
      // @ts-ignore
      [
        ...opStackChains.map(({ l1Contracts }) => {
          return {
            target: l1Contracts.l1CrossDomainMessenger.address,
            allowFailure: false,
            callData: getBridgeFundsFunctionData(address!),
            value: amount,
          }
        }),
      ],
    ],
    value: amount * BigInt(opStackChains.length),
    enabled: !!address && amount > 0n && opStackChains.length > 0,
  })

  return useContractWrite({
    ...config,
    onSuccess: (data) => {
      onSuccess(data.hash)
    },
  })
}

const getBlockExplorerLink = (chain: Chain, transactionHash: Hex) => {
  const baseUrl = chain.blockExplorers!.default.url
  return `${baseUrl}/tx/${transactionHash}`
}

export const BridgeCard = ({ l1Chain }: { l1Chain: Chain }) => {
  const chainId = l1Chain.id
  const chains = opStackChains.filter(
    (opStackChain) => opStackChain.l1Chain.id === chainId,
  )

  const formattedL1Balance = useFormattedBalance(chainId)

  const { toast } = useToast()

  const { selectedChains, allChains, setIsSelected, isSelectedByChainId } =
    useNetworkSelection(chains)

  const [amount, setAmount] = useState<bigint>(0n)

  const {
    write,
    isLoading,
    data: response,
  } = useBridgeWrite(selectedChains, amount, (hash: Hex) => {
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
  })

  const { isLoading: isConfirmationLoading } = useWaitForTransaction({
    hash: response?.hash,
    confirmations: 5,
    onSuccess: () => {
      toast({
        title: 'L1 transaction confirmed',
        description: `${truncateHash(response!.hash)}`,
        action: (
          <ToastAction
            altText="View on explorer"
            onClick={() => {
              window.open(
                getBlockExplorerLink(l1Chain, response!.hash),
                '_blank',
              )
            }}
          >
            View on explorer
          </ToastAction>
        ),
      })
    },
  })

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex justify-between">{l1Chain.name}</CardTitle>
        {formattedL1Balance && (
          <CardDescription>Balance: {formattedL1Balance}</CardDescription>
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
      <CardFooter className="flex justify-between">
        <Button
          className="w-full"
          disabled={isLoading || !write || isConfirmationLoading}
          onClick={() => {
            write?.()
          }}
        >
          Bridge
        </Button>
      </CardFooter>
    </Card>
  )
}
