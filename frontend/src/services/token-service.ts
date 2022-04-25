import { useStarknet, useStarknetCall } from '@starknet-react/core';
import {
  useAMMContract,
  useTokenAContract,
  useTokenBContract,
} from '~/hooks/contracts';

export enum TOKEN {
  A,
  B,
}

const TokenService = {
  getUserBalance(token: TOKEN) {
    const { account } = useStarknet();
    const tokenAContract = useTokenAContract().contract;
    const tokenBContract = useTokenBContract().contract;
    let contract;
    switch (token) {
      case TOKEN.A:
        contract = tokenAContract;
        break;
      case TOKEN.B:
        contract = tokenBContract;
        break;
    }

    return useStarknetCall({
      contract,
      method: 'balanceOf',
      args: account ? [account] : undefined,
    });
  },

  swap(token: TOKEN, amount: number) {
    const ammContract = useAMMContract().contract;
  },
};

export default TokenService;
