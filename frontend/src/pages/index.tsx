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
} from '@chakra-ui/react';
import {
  useStarknet,
  InjectedConnector,
  useStarknetInvoke,
} from '@starknet-react/core';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { SP } from 'next/dist/shared/lib/utils';
import { useCallback, useState } from 'react';
// import { Tag, Avatar, Text, TagLabel, NumberInput, NumberInputField, HStack, Stack, Spacer } from '@chakra-ui/react'
import TokenABalance from 'Components/tokenABalance';
import TokenBBalance from 'Components/tokenBBalance';
import React, { useMemo } from 'react';
import { useStarknetCall } from '@starknet-react/core';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import {
  useAMMContract,
  useTokenAContract,
  useTokenBContract,
} from '~/hooks/contracts';

const Home: NextPage = () => {
  const { account, connect } = useStarknet();

  //Limit
  //Test
  const [sell, setSell] = React.useState('');
  const [limit, setLimit] = useState('');
  const [showLimit, setShowLimit] = useState(false);

  const ammContract = useAMMContract().contract;
  const tokenAAddress = useTokenAContract().contract?.address;
  const tokenBAddress = useTokenBContract().contract?.address;

  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract: ammContract,
    method: 'swap',
  });

  console.log("tokenAAddress");

  const onSwapTokens = useCallback(() => {
    reset();
    const poolNb = 1;
    const token = tokenAAddress;
    const amountToUint = bnToUint256(sell);
    invoke({ args: [poolNb, token, amountToUint] });
  }, []);

  function putLimitOrder() {
    setShowLimit(true);
  }

  function cancelCurrentOrder() {
    //TODO
  }

  //Price A
  const resp1 = useStarknetCall({
    contract: ammContract,
    method: 'get_price',
    args: [1, tokenAAddress],
  });

  const priceA = useMemo(() => {
    if (resp1.loading || !resp1.data?.length) {
      return <div>Loading price</div>;
    }

    if (resp1.error) {
      return <div>Error: {resp1.error}</div>;
    }

    const price = resp1.data[0] / 1000000000000000000;
    return price;
  }, [resp1.data, resp1.loading, resp1.error]);

  //Price B
  const resp2 = useStarknetCall({
    contract: ammContract,
    method: 'get_price',
    args: [1, tokenBAddress],
  });

  const priceB = useMemo(() => {
    if (resp2.loading || !resp2.data?.length) {
      return <div>Loading price</div>;
    }

    if (resp2.error) {
      return <div>Error: {resp1.error}</div>;
    }

    const price = resp2.data[0] / 1000000000000000000;
    return price;
  }, [resp2.data, resp2.loading, resp2.error]);

  return (
    <Container maxW="container.sm">
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
        <Box
          role={'group'}
          p={6}
          w={'full'}
          bg={'white'}
          boxShadow={'2xl'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}
        >
          <Stack>
            <Tabs size={'lg'} isFitted colorScheme={'teal'}>
              <TabList>
                <Tab>Swap</Tab>
                <Tab>Limit</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack>
                    <Text>You sell</Text>
                    <HStack>
                      <NumberInput defaultValue={0.0} size="lg" width={400}>
                        <NumberInputField
                          onChange={(e) => setSell(e.currentTarget.value)}
                        />
                      </NumberInput>
                      <Tag size="lg" colorScheme="teal" borderRadius="full">
                        <Avatar
                          src="/ether.png"
                          size="xs"
                          name="eth"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>ETH</TagLabel>
                      </Tag>
                    </HStack>
                    <HStack>
                      <Spacer />
                      <TokenABalance />
                    </HStack>
                    <Text>You buy</Text>
                    <HStack>
                      <Text size="xl" width={400}>
                        {(sell * priceA) / priceB}
                      </Text>

                      <Tag size="lg" colorScheme="teal" borderRadius="full">
                        <Avatar
                          src="/StarkNet-Icon.png"
                          size="xs"
                          name="stark"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>STARK</TagLabel>
                      </Tag>
                    </HStack>
                    <HStack>
                      <Spacer />
                      <TokenBBalance />
                    </HStack>
                    <Button onClick={onSwapTokens} colorScheme="teal" size="lg">
                      Swap Tokens
                    </Button>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack>
                    <Stack>
                      <Text>You sell</Text>
                      <HStack>
                        <NumberInput defaultValue={0.0} size="lg" width={400}>
                          <NumberInputField
                            onChange={(e) => setSell(e.currentTarget.value)}
                          />
                        </NumberInput>
                        <Tag size="lg" colorScheme="teal" borderRadius="full">
                          <Avatar
                            src="/ether.png"
                            size="xs"
                            name="eth"
                            ml={-1}
                            mr={2}
                          />
                          <TagLabel>ETH</TagLabel>
                        </Tag>
                      </HStack>
                      <HStack>
                        <Spacer />
                        <TokenABalance />
                      </HStack>
                      <Text>You buy</Text>
                      <HStack>
                        <Text size="xl" width={400}>
                          {(sell * priceA) / priceB}
                        </Text>

                        <Tag size="lg" colorScheme="teal" borderRadius="full">
                          <Avatar
                            src="/StarkNet-Icon.png"
                            size="xs"
                            name="stark"
                            ml={-1}
                            mr={2}
                          />
                          <TagLabel>STARK</TagLabel>
                        </Tag>
                      </HStack>
                      <HStack>
                        <Spacer />
                        <TokenBBalance />
                      </HStack>
                    </Stack>
                    <Text>Limit Price</Text>
                    <HStack>
                      <NumberInput defaultValue={0.0} size="lg" width={400}>
                        <NumberInputField
                          onChange={(e) => setLimit(e.currentTarget.value)}
                        />
                      </NumberInput>
                      <Tag size="lg" colorScheme="teal" borderRadius="full">
                        <Avatar
                          src="/ether.png"
                          size="xs"
                          name="eth"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>ETH</TagLabel>
                      </Tag>
                    </HStack>
                    <Button
                      onClick={putLimitOrder}
                      colorScheme="teal"
                      size="lg"
                    >
                      Put Limit Order
                    </Button>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Divider />
            {showLimit && (
              <Stack>
                <Heading pt={8} size="md">
                  Current Limit Order
                </Heading>

                <Box
                  p={6}
                  w={'full'}
                  bg={'white'}
                  boxShadow={'md'}
                  rounded={'md'}
                  pos={'relative'}
                  zIndex={1}
                >
                  <Stack>
                    <HStack>
                      <Text>You sell: {sell}</Text>
                      <Tag size="lg" colorScheme="teal" borderRadius="full">
                        <Avatar
                          src="/ether.png"
                          size="xs"
                          name="eth"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>ETH</TagLabel>
                      </Tag>
                    </HStack>
                    <HStack>
                      <Text>You buy: {(sell * priceA) / priceB}</Text>
                      <Tag size="lg" colorScheme="teal" borderRadius="full">
                        <Avatar
                          src="/StarkNet-Icon.png"
                          size="xs"
                          name="stark"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>STARK</TagLabel>
                      </Tag>
                    </HStack>
                    <HStack>
                      <Text>Limit Price: {limit}</Text>
                      <Tag size="lg" colorScheme="teal" borderRadius="full">
                        <Avatar
                          src="/ether.png"
                          size="xs"
                          name="eth"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>ETH</TagLabel>
                      </Tag>
                    </HStack>
                    <HStack>
                      <Spacer />
                      <Button
                        onClick={cancelCurrentOrder}
                        colorScheme="teal"
                        size="lg"
                      >
                        Cancel Order
                      </Button>
                    </HStack>
                  </Stack>
                </Box>
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Container>
  );
};

export default Home;
