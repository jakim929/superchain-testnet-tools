import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useContractMetadata } from '@/lib/getContractMetadata'
import { useCrossDomainMessagesForTransactionHash } from '@/lib/getCrossDomainMessagesForTransactionHash'
import { goerli, optimismSepolia, sepolia } from 'viem/chains'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  indexedChains,
  IndexedChainId,
  indexedChainById,
} from '@superchain-testnet-tools/indexed-chains'
import { useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { Address, Hex, encodeFunctionData } from 'viem'
import { Input } from '@/components/ui/input'
import { opStackChainByL2ChainId } from '@superchain-testnet-tools/chains'
import { AddressSchema, HexSchema } from '@superchain-testnet-tools/common-ts'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { AbiFunction } from 'abitype'
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi'
import { z } from 'zod'
import { L1CrossDomainMessengerAbi } from '@/constants/L1CrossDomainMessengerAbi'
import { Button } from '@/components/ui/button'

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getSourceChain = (chainId: IndexedChainId) => {
  // TODO: fix to account for L2 => L1 message passing as well
  return opStackChainByL2ChainId[chainId].l1Chain
}

const supportedChainsForMessagePasser = indexedChains.filter(
  (chain) => ![goerli.id, sepolia.id].includes(chain.id as any),
)

const AddressInput = ({
  name,
  value,
  onChange,
}: {
  name: string
  value: Address
  onChange: (value: Address) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="">
        {name} <span className="text-gray-400">(address)</span>
      </Label>
      <Input
        type="text"
        id={name}
        placeholder="0x6aEF..."
        value={value}
        onChange={(e) => {
          const parseResult = AddressSchema.safeParse(e.target.value)
          if (parseResult.success) {
            onChange(parseResult.data)
          }
        }}
      />
    </div>
  )
}

const Uint256Input = ({
  name,
  value,
  onChange,
}: {
  name: string
  value: bigint
  onChange: (value: bigint) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="">
        {name} <span className="text-gray-400">(uint256)</span>
      </Label>
      <Input
        type="text"
        id={name}
        placeholder="1000"
        value={value.toString()}
        onChange={(e) => {
          const parseResult = z.coerce.bigint().safeParse(e.target.value)
          if (parseResult.success) {
            onChange(parseResult.data)
          }
        }}
      />
    </div>
  )
}

const Bytes32Input = ({
  name,
  value,
  onChange,
}: {
  name: string
  value: Hex
  onChange: (value: Hex) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="">
        {name} <span className="text-gray-400">(bytes32)</span>
      </Label>
      <Input
        type="text"
        id={name}
        placeholder="0xae4312..."
        value={value.toString()}
        onChange={(e) => {
          const parseResult = HexSchema.safeParse(e.target.value)
          if (parseResult.success) {
            onChange(parseResult.data)
          }
        }}
      />
    </div>
  )
}

const DynamicInput = ({
  name,
  value,
  type,
  onChange,
}: {
  name: string
  value: Address | bigint
  type: 'address' | 'uint256' | 'bytes32'
  onChange: (value: Address | bigint) => void
}) => {
  if (type === 'address') {
    return (
      <AddressInput
        name={name}
        value={value as Address}
        onChange={(value) => onChange(value)}
      />
    )
  } else if (type === 'bytes32') {
    return (
      <Bytes32Input
        name={name}
        value={value as Hex}
        onChange={(value) => onChange(value)}
      />
    )
  } else {
    return (
      <Uint256Input
        name={name}
        value={value as bigint}
        onChange={(value) => onChange(value)}
      />
    )
  }
}

const SwitchNetworkButton = ({
  chainId,
}: {
  chainId: IndexedChainId
}) => {
  const chainName = indexedChainById[chainId].name
  const { switchNetwork, isLoading } = useSwitchNetwork()
  if (!isLoading && !switchNetwork) {
    return <div>Please switch the network to {chainName} on your wallet</div>
  }
  return (
    <Button
      className="flex gap-2 items-center"
      onClick={() => switchNetwork?.(chainId)}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Switch
      network to {chainName}
    </Button>
  )
}

const WriteContractFunctionDisplay = ({
  abiItem,
  address,
  chainId,
}: {
  abiItem: AbiFunction
  address: Address
  chainId: IndexedChainId
}) => {
  const { chain } = useNetwork()
  const [functionParamByIndex, setFunctionParamByIndex] = useState<
    Record<number, any>
  >({})

  console.log(functionParamByIndex)

  const opStackChain = opStackChainByL2ChainId[chainId]
  const sourceChainId = opStackChain.l1Chain.id

  const targetContractFunctionParams = abiItem.inputs.map(
    (_, i) => functionParamByIndex[i],
  )

  const allParamsAreSet = targetContractFunctionParams.every(
    (x) => x !== undefined,
  )
  const encodedFunctionData = allParamsAreSet
    ? encodeFunctionData({
        abi: [abiItem],
        functionName: abiItem.name,
        args: targetContractFunctionParams,
      })
    : undefined
  console.log(encodedFunctionData)

  const { config } = usePrepareContractWrite({
    abi: L1CrossDomainMessengerAbi,
    functionName: 'sendMessage',
    address: opStackChain.l1Contracts.l1CrossDomainMessenger.address,
    chainId: opStackChain.l1Chain.id,
    // TODO: use actual gas estimation
    args: [address, encodedFunctionData!, 1000000],
    enabled: allParamsAreSet,
  })

  const {
    write,
    data,
    isLoading: isLoadingContractWrite,
  } = useContractWrite(config)

  const { isLoading: isLoadingConfirmation } = useWaitForTransaction({
    hash: data?.hash,
  })

  const isLoading = isLoadingContractWrite || isLoadingConfirmation
  const isDisabled = !write || isLoading

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-2 ">
        {abiItem.inputs.map((input, index) => {
          console.log('input', input)
          const inputName = input.name ? input.name : `arg${index}`
          return (
            <DynamicInput
              name={inputName}
              value={functionParamByIndex[index] || ''}
              type={input.type}
              onChange={(value) =>
                setFunctionParamByIndex((curVal) => {
                  return {
                    ...curVal,
                    [index]: value,
                  }
                })
              }
            />
          )
        })}
      </div>
      {chain?.id !== sourceChainId ? (
        <SwitchNetworkButton chainId={sourceChainId} />
      ) : (
        <Button
          onClick={() => write?.()}
          disabled={isDisabled}
          className="flex"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Send
          message
        </Button>
      )}
    </div>
  )
}

const ContractMetadataDisplay = ({
  chainId,
  address,
}: {
  chainId: IndexedChainId
  address?: Address
}) => {
  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useContractMetadata({
      chainId: chainId,
      address: address,
    })

  if (!address) {
    return null
  }

  console.log(contractMetadata)

  if (isContractMetadataLoading) {
    return (
      <div className="flex gap-4 items-center">
        <div>Looking up contract metadata...</div>
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    )
  }

  if (!contractMetadata) {
    return (
      <div className="flex gap-4 items-center">
        <div>Contract is not verified</div>
      </div>
    )
  }

  const writeFunctionAbiItems = contractMetadata.abi.filter(
    (x) =>
      x.type === 'function' &&
      (x.stateMutability === 'nonpayable' || x.stateMutability === 'payable'),
  ) as AbiFunction[]

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex justify-between items-center">
          {contractMetadata.name}
          <TooltipProvider delayDuration={300} skipDelayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Verified on {capitalizeFirstLetter(contractMetadata.source)}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Make sure the destination contract on {indexedChainById[chainId].name}{' '}
          handles msg.sender correctly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {writeFunctionAbiItems.map((abiItem) => {
            return (
              <AccordionItem value={abiItem.name}>
                <AccordionTrigger>{abiItem.name}</AccordionTrigger>
                <AccordionContent>
                  <WriteContractFunctionDisplay
                    address={address}
                    chainId={chainId}
                    abiItem={abiItem}
                  />
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}

const DestinationChainSelect = ({
  selectedChainId,
  setSelectedChainId,
}: {
  selectedChainId: IndexedChainId
  setSelectedChainId: (chainId: IndexedChainId) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="destination-chain-select" className="font-semibold">
        Destination chain
      </Label>
      <Select
        value={String(selectedChainId)}
        onValueChange={(value) =>
          setSelectedChainId(Number(value) as IndexedChainId)
        }
      >
        <SelectTrigger className="w-[180px]" id="destination-chain-select">
          <SelectValue placeholder="Chain" />
        </SelectTrigger>
        <SelectContent>
          {/* Only allow l2 chains for now because there's no withdrawal flow */}
          {supportedChainsForMessagePasser.map((chain) => {
            return (
              <SelectItem key={chain.id} value={String(chain.id)}>
                {chain.name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export const MessagePasserPage = () => {
  const result = useCrossDomainMessagesForTransactionHash(
    '0x17b8b82bacec8b6f522f21c96d81a046c01dd1c25e41951502dcf3db5b1b8a93',
  )

  const [selectedChainId, setSelectedChainId] = useState<IndexedChainId>(
    optimismSepolia.id,
  )

  const [targetAddressFormValue, setTargetAddressFormValue] = useState<string>(
    '0x640d842b0dad480531c49f68fc0b32a22aee5bba',
  )

  const parseResult = AddressSchema.safeParse(targetAddressFormValue)

  return (
    <div className="flex flex-col items-center">
      under construction...
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Message passer</CardTitle>
          <CardDescription>
            from{' '}
            <span className="font-semibold">
              {getSourceChain(selectedChainId).name}
            </span>{' '}
            to{' '}
            <span className="font-semibold">
              {indexedChainById[selectedChainId].name}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DestinationChainSelect
            selectedChainId={selectedChainId}
            setSelectedChainId={setSelectedChainId}
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="target-address" className="font-semibold">
              Target address
            </Label>
            <Input
              type="text"
              id="target-address"
              placeholder="0x6aEF..."
              value={targetAddressFormValue}
              onChange={(e) => setTargetAddressFormValue(e.target.value)}
            />
          </div>
          <ContractMetadataDisplay
            chainId={selectedChainId}
            address={parseResult.success ? parseResult.data : undefined}
          />
        </CardContent>
      </Card>
    </div>
  )
}
