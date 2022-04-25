import fs from 'fs';

import { Provider, Signer, Contract, Account } from 'starknet';

const compiledAmm = require('../../contracts/artifacts/amm.json');
const compiledOrders = require('../../contracts/artifacts/limit_orders.json');

export default class Starknet {
  provider: Provider;
  signer: Signer;
  account: Account;
  orders: any;
  ammContract: any;
  ordersContract: any;

  constructor(nodeUrl: string, accountContractAddress: string, keyPair: any) {
    this.provider = new Provider({
      baseUrl: nodeUrl,
      feederGatewayUrl: 'feeder_gateway',
      gatewayUrl: 'gateway',
    });
    this.signer = new Signer(keyPair);
    this.account = new Account(this.provider, accountContractAddress, keyPair);

    this.ammContract = new Contract(
      compiledAmm.abi,
      accountContractAddress,
      this.account,
    );
    this.ordersContract = new Contract(
      compiledOrders.abi,
      accountContractAddress,
      this.account,
    );
  }

  async collectOrders() {
    const orders = await this.ordersContract.get_orders();
    // ListenToNewOrders
  }

  async checkPrice(order: any) {
    const price = await this.getPrice(order.poolId, order.tokenIn);
    if (order.type === 'LIMIT' && price < order.price) {
      this.ordersContract.executeOrder(order.id);
    }
  }

  async getPrice(poolId: number, tokenIn: string) {
    const price = await this.ammContract.get_price(poolId, tokenIn);
    return price;
  }
}
