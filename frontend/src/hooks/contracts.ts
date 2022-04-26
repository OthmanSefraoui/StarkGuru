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
      '0x059a88de6e471b106cde978478817f432ffb475876dbdff0a36f134f9dc8f19b',
  });
}

export function useLimitOrderContract() {
  return useContract({
    abi: LimitOrderAbi as Abi,
    address:
      '0x0411e15f2ac7d0b9505e6437a0d315a8aac2f23127d6a0f4df9e3c0a7dd411dc',
  });
}
