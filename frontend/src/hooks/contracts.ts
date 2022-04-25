import { useContract } from '@starknet-react/core';
import { Abi } from 'starknet';

import Erc20Abi from '~/../../contracts/artifacts/abis/dummy_token.json';
import AMMAbi from '~/../../contracts/artifacts/abis/amm.json';

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
      '0x0648b65197c3c393867f0c53e11aeb8b89735532ba09abbd09005c6ea515ab33',
  });
}
