import {
  Tag,
  Avatar,
  Text,
  TagLabel,
  NumberInput,
  NumberInputField,
  HStack,
  Stack,
  Spacer,
} from '@chakra-ui/react';
import TokenABalance from 'Components/tokenABalance';
import TokenAPrice from './tokenAPrice';
import TokenBBalance from 'Components/tokenBBalance';
import { useState } from 'react';
import React, { useMemo } from 'react';
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import { uint256ToBN } from 'starknet/dist/utils/uint256';
import {
  useAMMContract,
  useTokenAContract,
  useTokenBContract,
} from '~/hooks/contracts';

const SwapTokens = () => {
  const [valueA, setValueA] = React.useState('');

  //Price A
  const { account } = useStarknet();
  const { contract } = useAMMContract();
  const tokenAAddress = useTokenAContract().contract?.address;

  console.log(tokenAAddress);

  const resp1 = useStarknetCall({
    contract,
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
  const tokenAddressB = useTokenBContract().contract?.address;
  const resp2 = useStarknetCall({
    contract,
    method: 'get_price',
    args: [1, tokenAddressB],
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
    <Stack>
      <Text>You sell</Text>
      <HStack>
        <NumberInput defaultValue={0.0} size="lg" width={400}>
          <NumberInputField
            onChange={(e) => setValueA(e.currentTarget.value)}
          />
        </NumberInput>
        <Tag size="lg" colorScheme="teal" borderRadius="full">
          <Avatar src="/usdc.png" size="xs" name="usdc" ml={-1} mr={2} />
          <TagLabel>USDC</TagLabel>
        </Tag>
      </HStack>
      <HStack>
        <Spacer />
        <TokenABalance />
      </HStack>
      <Text>You buy</Text>
      <HStack>
        <Text size="xl" width={400}>
          {(valueA * priceA) / priceB}
        </Text>

        <Tag size="lg" colorScheme="teal" borderRadius="full">
          <Avatar src="/ether.png" size="xs" name="Ether" ml={-1} mr={2} />
          <TagLabel>ETH</TagLabel>
        </Tag>
      </HStack>
      <HStack>
        <Spacer />
        <TokenBBalance />
      </HStack>
    </Stack>
  );
};

export default SwapTokens;
