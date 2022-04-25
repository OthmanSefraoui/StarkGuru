import {
  Avatar,
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from '@starknet-react/core';
import TokenABalance from 'Components/tokenABalance';
import TokenAPrice from 'Components/tokenAPrice';
import TokenBBalance from 'Components/tokenBBalance';
import TokenBPrice from 'Components/tokenBPrice';
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

// function UserBalance() {
//   const { account } = useStarknet();
//   const { contract } = useTokenAContract();

//   const { data, loading, error } = useStarknetCall({
//     contract,
//     method: 'balanceOf',
//     args: account ? [account] : undefined,
//   });

//   const content = useMemo(() => {
//     if (loading || !data?.length) {
//       return <div>Loading balance</div>;
//     }

//     if (error) {
//       return <div>Error: {error}</div>;
//     }

//     const balance = uint256ToBN(data[0]);
//     return <div>{balance.toString(10)}</div>;
//   }, [data, loading, error]);

//   return (
//     <div>
//       <h2>User balance</h2>
//       {content}
//     </div>
//   );
// }

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
    <Button colorScheme="red" onClick={onFaucetA}>
      {loading ? 'Waiting for wallet' : 'Get some tokens A'}
    </Button>
    // <button onClick={onFaucetA}>
    //   {loading ? 'Waiting for wallet' : 'Get some tokens A'}
    // </button>
    // {error && <p>Error: {error}</p>}
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
      <Button colorScheme="blue" onClick={onFaucetB}>
        {loading ? 'Waiting for wallet' : 'Get some tokens B'}
      </Button>
      {/* <button onClick={onFaucetB}>
        {loading ? 'Waiting for wallet' : 'Faucet B'}
      </button>
      {error && <p>Error: {error}</p>} */}
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
    <Stack>
      <Text>You sell</Text>
      <HStack>
        <NumberInput defaultValue={0.0} size="lg" width={400}>
          <NumberInputField />
        </NumberInput>
        <Tag size="lg" colorScheme="teal" borderRadius="full">
          <Avatar src="/usdc.png" size="xs" name="usdc" ml={-1} mr={2} />
          <TagLabel>USDC</TagLabel>
        </Tag>
        <TokenABalance />
        <TokenAPrice />
      </HStack>
      <Text>You sell</Text>
      <HStack>
        <NumberInput defaultValue={0.0} size="lg" width={400}>
          <NumberInputField />
        </NumberInput>
        <Tag size="lg" colorScheme="teal" borderRadius="full">
          <Avatar src="/ether.png" size="xs" name="Ether" ml={-1} mr={2} />
          <TagLabel>ETH</TagLabel>
        </Tag>
        <TokenBBalance />
        <TokenBPrice />
      </HStack>
      <HStack>
        <FaucetA></FaucetA>
      </HStack>
      <HStack>
        <FaucetB></FaucetB>
      </HStack>
    </Stack>
    // <div>
    //   <h2>Swap tokens</h2>
    //   <p>
    //     <span>Amount of token A: </span>
    //     <input
    //       type="number"
    //       onChange={(evt) => updateAmountA(evt.target.value)}
    //     />
    //   </p>

    //   <p>
    //     <span>Amount of token B: </span>
    //     <input
    //       type="number"
    //       onChange={(evt) => updateAmountB(evt.target.value)}
    //     />
    //   </p>

    //   <button disabled={swapButtonDisabled} onClick={onSwap}>
    //     {loading ? 'Waiting for wallet' : 'Swap'}
    //   </button>
    //   {error && <p>Error: {error}</p>}
    // </div>
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
      <h2>SWAP</h2>
      <SwapTokens></SwapTokens>
      {/* <TransactionList /> */}
    </div>
  );
};

export default TokenPage;
