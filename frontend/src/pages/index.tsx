import type { NextPage } from 'next';
import {
  Container,
  Heading,
  Text,
  Button,
  NumberInput,
  NumberInputField,
  HStack,
  Divider,
} from '@chakra-ui/react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from '@chakra-ui/react';
import SwapTokens from 'Components/swapTokens';
import { useStarknet, InjectedConnector } from '@starknet-react/core';
import { MdAccountBalanceWallet } from 'react-icons/md';

const Home: NextPage = () => {
  const { account, connect } = useStarknet();

  // if (account) {
  //   return <p>Account: {account}</p>
  // }

  // return

  return (
    <Container maxW="container.sm">
      <Heading>Stark Guru</Heading>
      <Divider />

      {account == null ? (
        <Container centerContent p={8}>
          <Button
            colorScheme={'orange'}
            padding={8}
            size={'lg'}
            rightIcon={<MdAccountBalanceWallet />}
            onClick={() => connect(new InjectedConnector())}
          >
            Connect with Argent X
          </Button>
        </Container>
      ) : (
        <Stack>
          <Tabs size={'lg'}>
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
          <Button colorScheme="teal" size="md">
            Swap Tokens
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default Home;
