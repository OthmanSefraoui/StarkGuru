import React, { useMemo } from 'react';
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import { uint256ToBN } from 'starknet/dist/utils/uint256';
import { useTokenAContract } from '~/hooks/contracts';
import { Text } from '@chakra-ui/react';

const TokenABalance = () => {
  const { account } = useStarknet();
  const { contract } = useTokenAContract();
  const { data, loading, error } = useStarknetCall({
    contract,
    method: 'balanceOf',
    args: account ? [account] : undefined,
  });

  const content = useMemo(() => {
    if (loading || !data?.length) {
      return <div>Loading balance</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    const balance = uint256ToBN(data[0]);
    return <span>{balance.toString(10)}</span>;
  }, [data, loading, error]);

  return (
    <Text color = 'gray.500'>User balance: {content}</Text>
  );
};

export default TokenABalance;
