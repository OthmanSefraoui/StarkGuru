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
import {
  useTokenAContract,
  useTokenBContract,
  useAMMContract,
} from '~/hooks/contracts';

function UserBalance() {
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

function FaucetA() {
  const { contract } = useTokenAContract();

  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract,
    method: 'faucet',
  });

  const onFaucetA = useCallback(() => {
    reset();
    invoke({ args: [] });
  }, []);

  return (
    <div>
      <h2>Faucet A</h2>
      <button onClick={onFaucetA}>
        {loading ? 'Waiting for wallet' : 'Faucet A'}
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

  const onFaucetB = useCallback(() => {
    reset();
    invoke({ args: [] });
  }, []);

  return (
    <div>
      <h2>Faucet B</h2>
      <button onClick={onFaucetB}>
        {loading ? 'Waiting for wallet' : 'Faucet B'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

function SwapTokens() {
  const { account } = useStarknet();
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [amountError, setAmountError] = useState<string | undefined>();

  const { contract } = useAMMContract();

  const { loading, error, reset, invoke } = useStarknetInvoke({
    contract,
    method: 'mint',
  });

  const updateAmountA = useCallback(
    (newAmount: string) => {
      // soft-validate amount
      setAmountA(newAmount);
      try {
        toBN(newAmount);
        setAmountError(undefined);
      } catch (err) {
        console.error(err);
        setAmountError('Please input a valid number');
      }
    },
    [setAmountA]
  );

  const updateAmountB = useCallback(
    (newAmount: string) => {
      // soft-validate amount
      setAmountB(newAmount);
      try {
        toBN(newAmount);
        setAmountError(undefined);
      } catch (err) {
        console.error(err);
        setAmountError('Please input a valid number');
      }
    },
    [setAmountB]
  );

  const onSwap = useCallback(() => {
    reset();
    if (!amountError) {
      const poolNb = 1;
      const amountABn = bnToUint256(amountA);
      const amountBBn = bnToUint256(amountB);
      invoke({ args: [poolNb, amountABn, amountBBn] });
    }
  }, []);

  const swapButtonDisabled = useMemo(() => {
    if (loading) return true;
    return !account || !!amountError;
  }, [loading, account, amountError]);

  return (
    <div>
      <h2>Swap tokens</h2>
      <p>
        <span>Amount of token A: </span>
        <input
          type="number"
          onChange={(evt) => updateAmountA(evt.target.value)}
        />
      </p>

      <p>
        <span>Amount of token B: </span>
        <input
          type="number"
          onChange={(evt) => updateAmountB(evt.target.value)}
        />
      </p>

      <button disabled={swapButtonDisabled} onClick={onSwap}>
        {loading ? 'Waiting for wallet' : 'Swap'}
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
      <FaucetA />
      <FaucetB />

      <h2>SWAP</h2>
      <SwapTokens></SwapTokens>

      <TransactionList />
    </div>
  );
};

export default TokenPage;
