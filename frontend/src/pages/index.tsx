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
  Spacer,
} from '@chakra-ui/react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Box,
  Tag, 
  TagLabel,
  Avatar, 
  StackDivider
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
            <Tabs size={"lg"} isFitted colorScheme={"teal"}>
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
                    <Text>Limit Price</Text>
                    <HStack>
                      <NumberInput defaultValue={0.0} size="lg" width={400}>
                        <NumberInputField/>
                      </NumberInput>
                      <Tag size='lg' colorScheme='teal' borderRadius='full'>
                        <Avatar
                          src='/usdc.png'
                          size='xs'
                          name='usdc'
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>USDC</TagLabel>
                      </Tag>
                    </HStack>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Button colorScheme='teal' size="lg">
              Swap Tokens
            </Button>
          </Stack>
        </Box>
      }
    </Container>
  );
};

export default Home;
