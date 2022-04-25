import { useContract } from '@starknet-react/core';
import { Abi } from 'starknet';

import Erc20Abi from '~/../../contracts/artifacts/abis/dummy_token.json';
import AMMAbi from '~/../../contracts/artifacts/abis/amm.json';
import LimitOrderAbi from '~/../../contracts/artifacts/abis/limit_orders.json';

export function useTokenAContract() {
  return useContract({
    abi: Erc20Abi as Abi,
    address:
      '0x02441a8eca8fc98844abb73ea19a86fd21663d60fb67e31a91501a1c50b8fb1c',
  });
}

export function useTokenBContract() {
  return useContract({
    abi: Erc20Abi as Abi,
    address:
      '0x07c7e61881dce50588e0f0d5f13ebfdc979002a2e1ee62fc931527548e6b225d',
  });
}

export function useAMMContract() {
  return useContract({
    abi: AMMAbi as Abi,
    address:
      '0x06d997027507576cc87b10c2ed414aba776c891b57313d64afa69f12d1fa1f42',
  });
}

export function useLimitOrderContract() {
  return useContract({
    abi: LimitOrderAbi as Abi,
    address:
      '0x0475d0afcd9b763234e1cabb8830dc8af3eca774966c1054dce8a31d3b124a8c',
  });
}
