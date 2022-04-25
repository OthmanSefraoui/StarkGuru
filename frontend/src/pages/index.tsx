import { useStarknetCall } from '@starknet-react/core'
import type { NextPage } from 'next'
import { useMemo } from 'react'
import { toBN } from 'starknet/dist/utils/number'
import { ConnectWallet } from '~/components/ConnectWallet'
import { IncrementCounter } from '~/components/IncrementCounter'
import { TransactionList } from '~/components/TransactionList'
import { useCounterContract } from '~/hooks/counter'
import { Container, Heading, Text, Button, NumberInput, NumberInputField, HStack, Select } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Stack } from '@chakra-ui/react'
import SwapTokens from 'Components/swapTokens'

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
    <Container maxW="container.sm">
      <Heading>
        Stark Guru
      </Heading>
      <ConnectWallet />
      <Tabs size={"lg"}>
        <TabList>
          <Tab>Swap</Tab>
          <Tab>Limit</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SwapTokens />
          </TabPanel>
          <TabPanel>
            <Stack>
            <SwapTokens />
            <Text>Limit Price USD</Text>
            <HStack>
              <NumberInput defaultValue={0.0}>
                <NumberInputField />
              </NumberInput>
            </HStack>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Button colorScheme='teal' size='md'>
        Swap Tokens
      </Button>
    </Container>
  )
}

export default Home
