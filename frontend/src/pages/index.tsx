import { useStarknetCall } from '@starknet-react/core'
import type { NextPage } from 'next'
import { useMemo } from 'react'
import { toBN } from 'starknet/dist/utils/number'
import { ConnectWallet } from '~/components/ConnectWallet'
import { IncrementCounter } from '~/components/IncrementCounter'
import { TransactionList } from '~/components/TransactionList'
import { useCounterContract } from '~/hooks/counter'
import { Container, Heading, Text, Button, NumberInput, NumberInputField, HStack, Select, Divider } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Stack, Box } from '@chakra-ui/react'
import SwapTokens from 'Components/swapTokens'
import { useStarknet, InjectedConnector } from '@starknet-react/core'
import { MdAccountBalanceWallet } from "react-icons/md"


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

  const { account, connect } = useStarknet()

  // if (account) {
  //   return <p>Account: {account}</p>
  // }

  // return 

  return (
    <Container maxW="container.sm">
      {account == null ?
        <Container centerContent p={8}>
          <Button colorScheme={"orange"} padding={8} size={"lg"} rightIcon={<MdAccountBalanceWallet />} onClick={() => connect(new InjectedConnector())}>Connect with Argent X</Button>
        </Container> :
        <Box
          role={'group'}
          p={6}
          w={'full'}
          bg={'white'}
          boxShadow={'2xl'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}>
          <Stack>
            <Tabs size={"lg"} isFitted>
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
          </Stack>
        </Box>
      }
    </Container>
  )
}

export default Home
