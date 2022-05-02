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
  TagLeftIcon,
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
import { MdAccountBalanceWallet, MdInfoOutline } from 'react-icons/md';
import { useState } from 'react';
// import { Tag, Avatar, Text, TagLabel, NumberInput, NumberInputField, HStack, Stack, Spacer } from '@chakra-ui/react'
import TokenABalance from 'Components/tokenABalance';
import TokenBBalance from 'Components/tokenBBalance';
import React, { useMemo } from 'react';
import { useStarknetCall } from '@starknet-react/core';
import {
  useAMMContract,
  useLimitOrderContract,
  useTokenAContract,
  useTokenBContract,
} from '~/hooks/contracts';
import { hexToDecimalString } from 'starknet/dist/utils/number';
import { Call } from 'starknet';

const Home: NextPage = () => {
  const { account, connect, connectors } = useStarknet();
  const POOL_ID = 1;

  //Limit
  //Test
  const [sell, setSell] = useState('');
  const [limitPrice, setLimit] = useState('');
  const [error, setError] = useState('');
  const [showLimit, setShowLimit] = useState(false);
  const userOrders: any[] = [];

  const amm = useAMMContract();
  const limitOrder = useLimitOrderContract();
  const tokenA = useTokenAContract();
  const tokenB = useTokenBContract();

  const approveAndSwap = (withLimit?: boolean) => {
    const account_ = connectors[0].account();
    account_.then((account) => {
      try {
        const poolId = POOL_ID;
        const amount =
          sell == '' ? 0 : Number.parseFloat(sell) * 1000000000000000000;
        const token: string = hexToDecimalString(
          tokenA.contract?.address || ''
        );

        let spender;
        let swapCall: Call;
        if (withLimit) {
          spender = limitOrder.contract?.address;
          const price = (
            Number.parseFloat(limitPrice) * 1000000000000000000
          ).toString();
          swapCall = {
            contractAddress: limitOrder.contract?.address || '',
            entrypoint: 'create_order',
            calldata: [poolId, price, amount.toString(), token],
          };
        } else {
          spender = amm.contract?.address;
          swapCall = {
            contractAddress: amm.contract?.address || '',
            entrypoint: 'swap',
            calldata: [poolId, amount.toString(), token],
          };
        }

        account
          .execute([
            {
              contractAddress: tokenA.contract?.address || '',
              entrypoint: 'approve',
              calldata: [spender, amount.toString(), '0'],
            },
            swapCall,
          ])
          .then((resp) => {
            if (withLimit) {
              setShowLimit(true);
            }
          });
      } catch (error: any) {
        setError(error);
      }
    });
  };

  const onSwap = () => {
    approveAndSwap();
  };

  const onPlaceOrderLimit = () => {
    approveAndSwap(true);
  };

  // Cancel Order
  const cancelOrder = useStarknetInvoke({
    contract: limitOrder.contract,
    method: 'cancel_order',
  });

  const onCancelOrder = () => {
    cancelOrder.reset();
    const order_id = '';
    cancelOrder.invoke({ args: [order_id] });
  };

  // Price A
  const tokenAPrice = useStarknetCall({
    contract: amm.contract,
    method: 'get_price',
    args: [POOL_ID, tokenA.contract?.address],
  });

  const priceA = useMemo(() => {
    if (tokenAPrice.loading || !tokenAPrice.data?.length || tokenAPrice.error) {
      return 0;
    }

    return tokenAPrice.data[0] / 1000000000000000000;
  }, [tokenAPrice.data, tokenAPrice.loading, tokenAPrice.error]);

  //Price B
  const tokenBPrice = useStarknetCall({
    contract: amm.contract,
    method: 'get_price',
    args: [POOL_ID, tokenB.contract?.address],
  });

  const priceB = useMemo(() => {
    if (tokenBPrice.loading || !tokenBPrice.data?.length || tokenBPrice.error) {
      return 0;
    }

    return tokenBPrice.data[0] / 1000000000000000000;
  }, [tokenBPrice.data, tokenBPrice.loading, tokenBPrice.error]);

  const nbOrders = useStarknetCall({
    contract: limitOrder.contract,
    method: 'get_number_of_orders',
    args: [],
  });

  const [orderId, setOrderId] = useState(0);

  const order = useStarknetCall({
    contract: limitOrder.contract,
    method: 'get_order',
    args: [orderId],
  });

  const getOrder = useMemo(() => {
    if (order.loading || !order.data?.length || order.error) {
      return 0;
    }

    console.log('orderId:', orderId, 'order: ', order.data[0]);

    return order.data[0];
  }, [order.data, order.loading, order.error]);

  const getOrders = useMemo(() => {
    if (nbOrders.loading || !nbOrders.data?.length || nbOrders.error) {
      return [];
    }

    const orders = [];

    for (let i = 0; i < nbOrders.data[0].words; i++) {
      setOrderId(i);
      const order = getOrder;

      orders.push(order);
    }

    userOrders.push(...orders);

    return userOrders;
  }, [nbOrders.data, nbOrders.loading, nbOrders.error]);

  return (
    <Container maxW="container.sm">
      {account == null ? (
        <Container centerContent p={8}>
          <Button
            colorScheme={'teal'}
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
                    <HStack>
                      <Text>
                        {/* {userOrders.map((order) => {
                          return order;
                        })} */}
                        Orders:{' '}
                        {getOrders.map((order) => {
                          return JSON.stringify(order);
                        })}
                      </Text>
                    </HStack>
                    <Text>You buy</Text>
                    <HStack>
                      <Text size="xl" width={400}>
                        {tokenAPrice.loading || tokenBPrice.loading
                          ? 'Loading...'
                          : (sell == ''
                              ? 0
                              : Number.parseFloat(sell) * priceA) / priceB}
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
                    <Tag
                      size={'lg'}
                      key={'1'}
                      variant="subtle"
                      colorScheme="teal"
                    >
                      <TagLeftIcon as={MdInfoOutline} />
                      <TagLabel>1 ETH = {priceA / priceB} STARK</TagLabel>
                    </Tag>
                    <Button onClick={onSwap} colorScheme="teal" size="lg">
                      Swap Tokens
                    </Button>
                    {error && <p>Error: {error}</p>}
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
                          {(sell == '' ? 0 : Number.parseFloat(sell) * priceA) /
                            priceB}
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
                    <Tag
                      size={'lg'}
                      key={'1'}
                      variant="subtle"
                      colorScheme="teal"
                    >
                      <TagLeftIcon as={MdInfoOutline} />
                      <TagLabel>1 ETH = {priceA / priceB} STARK</TagLabel>
                    </Tag>
                    <Text>Limit Price</Text>
                    <HStack>
                      <NumberInput defaultValue={0.0} size="lg" width={400}>
                        <NumberInputField
                          onChange={(e) => setLimit(e.currentTarget.value)}
                        />
                      </NumberInput>
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
                    <Button
                      onClick={onPlaceOrderLimit}
                      colorScheme="teal"
                      size="lg"
                    >
                      Put Limit Order
                    </Button>
                    {error && <p>Error: {error}</p>}
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
                      <Text>
                        You buy:{' '}
                        {(sell == '' ? 0 : Number.parseFloat(sell) * priceA) /
                          priceB}
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
                      <Text>Limit Price: {limitPrice}</Text>
                      <Tag size="lg" colorScheme="teal" borderRadius="full">
                        <Avatar
                          src="/StarkNet-Icon.png"
                          size="xs"
                          name="stark"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>ETH</TagLabel>
                      </Tag>
                    </HStack>
                    <HStack>
                      <Spacer />
                      <Button
                        onClick={onCancelOrder}
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
