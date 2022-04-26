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
      '0x01427bbdec8eb19861e7a989f15af200405fc9264ad655fa57f145a51922d54f',
  });
}

export function useLimitOrderContract() {
  return useContract({
    abi: LimitOrderAbi as Abi,
    address:
      '0x042a56ea3d20ed1441bfc8de850144cfa048bb03c36e1885efa06e2b7319048f',
  });
}
