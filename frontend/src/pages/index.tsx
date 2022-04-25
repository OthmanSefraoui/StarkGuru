import { useStarknetCall } from '@starknet-react/core'
import type { NextPage } from 'next'
import { useMemo } from 'react'
import { toBN } from 'starknet/dist/utils/number'
import { ConnectWallet } from '~/components/ConnectWallet'
import { IncrementCounter } from '~/components/IncrementCounter'
import { TransactionList } from '~/components/TransactionList'
import { useCounterContract } from '~/hooks/counter'
import { Container, Heading, Text } from '@chakra-ui/react'

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
      <Heading>
        Counter Contract
      </Heading>
      <Text>{counter?.address}</Text>
      <Text>{counterValue}</Text>
      <Text>Recent Transactions</Text>
      <TransactionList />
    </Container>
  )
}

export default Home
