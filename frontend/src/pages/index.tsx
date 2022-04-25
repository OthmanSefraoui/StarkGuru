import { useStarknetCall } from '@starknet-react/core'
import type { NextPage } from 'next'
import { useMemo } from 'react'
import { toBN } from 'starknet/dist/utils/number'
import { ConnectWallet } from '~/components/ConnectWallet'
import { IncrementCounter } from '~/components/IncrementCounter'
import { TransactionList } from '~/components/TransactionList'
import { useCounterContract } from '~/hooks/counter'
import { Container, Heading, Text, Button, NumberInput, NumberInputField, HStack, Select } from '@chakra-ui/react'

const Home: NextPage = () => {
  const { contract: counter } = useCounterContract()

  const { data: counterResult } = useStarknetCall({
    contract: counter,
    method: 'counter',
    args: [],
  })

  const counterValue = useMemo(() => {
    if (counterResult && counterResult.length > 0) {
      const value = toBN(counterResult[0])
      return value.toString(10)
    }
  }, [counterResult])

  return (
    <Container>
      <Heading>
        Stark Guru
      </Heading>
      <ConnectWallet />
      <Heading>Swap</Heading>
      <HStack>
        <NumberInput defaultValue={0.0}>
          <NumberInputField />
        </NumberInput>
        <Select placeholder='Select option'>
          <option value='option1'>ETH</option>
          <option value='option2'>DAI</option>
          <option value='option3'>USDC</option>
        </Select>
      </HStack>
      <HStack>
        <NumberInput defaultValue={0.0}>
          <NumberInputField />
        </NumberInput>
        <Select placeholder='Select option'>
          <option value='option1'>ETH</option>
          <option value='option2'>DAI</option>
          <option value='option3'>USDC</option>
        </Select>
      </HStack>

      <Button colorScheme='teal' size='md'>
        Swap Tokens
      </Button>
    </Container>
  )
}

export default Home
