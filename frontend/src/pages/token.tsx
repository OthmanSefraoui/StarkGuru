import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from '@starknet-react/core';
import type { NextPage } from 'next';
import { useCallback, useMemo, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { ConnectWallet } from '~/components/ConnectWallet';
import { TransactionList } from '~/components/TransactionList';
import { useTokenContract, useTokenBContract } from '~/hooks/tokenAContract';

function UserBalance() {
  const { account } = useStarknet();
  const { contract } = useTokenContract();

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
    return <div>{balance.toString(10)}</div>;
  }, [data, loading, error]);

  return (
    <div>
      <h2>User balance</h2>
      {content}
    </div>
  );
}

function UserBalanceB() {
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
    return <div>{balance.toString(10)}</div>;
  }, [data, loading, error]);

  return (
    <div>
      <h2>User balance Token B</h2>
      {content}
    </div>
  );
}

function Faucet() {
  const { contract } = useTokenContract();

  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract,
    method: 'faucet',
  });

  const onFaucet = useCallback(() => {
    reset();
    invoke({ args: [] });
  }, []);

  return (
    <div>
      <h2>Faucet</h2>
      <button onClick={onFaucet}>
        {loading ? 'Waiting for wallet' : 'Faucet'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

function FaucetB() {
  const { contract } = useTokenBContract();

  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract,
    method: 'faucet',
  });

  const onFaucet = useCallback(() => {
    reset();
    invoke({ args: [] });
  }, []);

  return (
    <div>
      <h2>Faucet B</h2>
      <button onClick={onFaucet}>
        {loading ? 'Waiting for wallet' : 'Faucet B'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

const TokenPage: NextPage = () => {
  const { account } = useStarknet();

  if (!account) {
    return (
      <div>
        <p>Connect Wallet</p>
        <ConnectWallet />
      </div>
    );
  }
  return (
    <div>
      <p>Connected: {account}</p>
      <UserBalance />
      <UserBalanceB />
      <Faucet />
      <FaucetB />
      <TransactionList />
    </div>
  );
};

export default TokenPage;
