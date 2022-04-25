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
  Box
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
  );
};

export default Home;
