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
  TagLeftIcon
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
import { MdAccountBalanceWallet, MdInfoOutline  } from 'react-icons/md';
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
  useLimitOrderContract,
  useTokenAContract,
  useTokenBContract,
} from '~/hooks/contracts';
import { hexToDecimalString } from 'starknet/dist/utils/number';

const Home: NextPage = () => {
  const { account, connect } = useStarknet();

  //Limit
  //Test
  const [sell, setSell] = React.useState('');
  const [limitPrice, setLimit] = useState('');
  const [showLimit, setShowLimit] = useState(false);
  const [approved, setApproved] = useState(false);

  const amm = useAMMContract();
  const limitOrder = useLimitOrderContract();
  const tokenA = useTokenAContract();
  const tokenB = useTokenBContract();

  const approveTx = useStarknetInvoke({
    contract: useTokenAContract().contract,
    method: 'approve',
  });

  const swap = useStarknetInvoke({
    contract: amm.contract,
    method: 'swap',
  });

  const putLimitOrder = useStarknetInvoke({
    contract: limitOrder.contract,
    method: 'create_order',
  });

  const tokenAddressAsString: string = hexToDecimalString(
    tokenA.contract?.address || ''
  );

  const onApproveTx = () => {
    approveTx.reset();
    const spender = amm.contract?.address;
    const felt = Number.parseInt(sell) * 1000000000000000000;
    const amount = bnToUint256(felt.toString());
    approveTx.invoke({ args: [spender, amount] });
    setApproved(true);
  };

  const onSwapTokens = () => {
    swap.reset();
    const poolId = 1;
    const felt = Number.parseInt(sell) * 1000000000000000000;
    const amount = felt.toString();
    const token = tokenAddressAsString;
    swap.invoke({ args: [poolId, amount, token] });
    setApproved(false);
  };

  const onPutLimitOrder = () => {
    swap.reset();
    const poolId = 1;
    const price = (Number.parseInt(limitPrice) * 1000000000000000000).toString;
    const amount = (Number.parseInt(sell) * 1000000000000000000).toString;
    const token = tokenAddressAsString;
    swap.invoke({ args: [poolId, price, amount, token] });
    setApproved(false);
  };

  function cancelCurrentOrder() {
    //TODO
  }

  //Price A
  const resp1 = useStarknetCall({
    contract: amm.contract,
    method: 'get_price',
    args: [1, tokenA.contract?.address],
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
    contract: amm.contract,
    method: 'get_price',
    args: [1, tokenB.contract?.address],
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
                      <Tag size={"lg"} key={"1"} variant='subtle' colorScheme='teal'>
                        <TagLeftIcon as={MdInfoOutline} />
                        <TagLabel>1 ETH = {priceA / priceB} STARK</TagLabel>
                      </Tag>
                    <Button
                      hidden={approved}
                      onClick={onApproveTx}
                      colorScheme="teal"
                      size="lg"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={onSwapTokens}
                      hidden={!approved}
                      colorScheme="teal"
                      size="lg"
                    >
                      Swap Tokens
                    </Button>
                    {swap.error && <p>Error: {swap.error}</p>}
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
                      <Tag size={"lg"} key={"1"} variant='subtle' colorScheme='teal'>
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
                      hidden={approved}
                      onClick={onApproveTx}
                      colorScheme="teal"
                      size="lg"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={onPutLimitOrder}
                      hidden={!approved}
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
                      <Text>Limit Price: {limitPrice}</Text>
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
