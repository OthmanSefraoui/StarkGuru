import React, { useMemo } from 'react';
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import { uint256ToBN } from 'starknet/dist/utils/uint256';
import { useTokenBContract } from '~/hooks/contracts';

const TokenBBalance = () => {
  const { account } = useStarknet();
  const { contract } = useTokenBContract();
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
    <div>
      <h2>User balance</h2>
      {content}
    </div>
  );
};

export default TokenBBalance;
