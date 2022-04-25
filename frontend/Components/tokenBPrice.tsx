import React, { useMemo } from 'react';
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import { uint256ToBN } from 'starknet/dist/utils/uint256';
import { useAMMContract, useTokenBContract } from '~/hooks/contracts';
import { Text } from '@chakra-ui/react';

const TokenBPrice = () => {
  const { account } = useStarknet();
  const { contract } = useAMMContract();
  const tokenAddress = useTokenBContract().contract?.address;
  const { data, loading, error } = useStarknetCall({
    contract,
    method: 'get_price',
    args: [1, tokenAddress],
  });

  const content = useMemo(() => {
    if (loading || !data?.length) {
      return <div>Loading price</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    const price = data[0] / 1000000000000000000;
    return <span>{price.toString(10)}</span>;
  }, [data, loading, error]);

  return <Text color="gray.500">Token price: {content}</Text>;
};

export default TokenBPrice;
