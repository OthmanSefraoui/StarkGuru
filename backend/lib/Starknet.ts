import fs from 'fs';
import BN from 'bn.js';
import { ec, Provider, Signer, Contract, Account, number } from 'starknet';

const privKey =
  '242ae51856e2ddcf0b24d471f6277947439fa57babf41f246cc76b0ab5a98e';
const compiledAmm = require('../../contracts/artifacts/amm.json');
const compiledOrders = require('../../contracts/artifacts/limit_orders.json');
const {
  account: accountAddress,
  amm: ammAddress,
  orders: ordersAddress,
} = require('../address.json');

export default class Starknet {
  provider: Provider;
  signer: Signer;
  account: Account;
  orders: any[];
  lastOrderFetched: number;
  ammContract: Contract;
  ordersContract: Contract;

  constructor(nodeUrl: string) {
    this.orders = [];
    this.lastOrderFetched = 0;
    this.provider = new Provider({
      baseUrl: nodeUrl,
      feederGatewayUrl: 'feeder_gateway',
      gatewayUrl: 'gateway',
    });

    const recover = ec.ec.keyFromPrivate(privKey);

    this.signer = new Signer(recover);
    this.account = new Account(this.provider, accountAddress, this.signer);

    this.ammContract = new Contract(compiledAmm.abi, ammAddress, this.account);
    this.ordersContract = new Contract(
      compiledOrders.abi,
      ordersAddress,
      this.account,
    );
  }

  async collectOrders() {
    const numberOfOrders = await this.ordersContract.get_number_of_orders();

    console.log(
      `${numberOfOrders[0].sub(new BN(this.lastOrderFetched))} new order(s)`,
    );

    for (
      let i = this.lastOrderFetched + 1;
      i <= numberOfOrders[0].toNumber();
      i += 1
    ) {
      const order = await this.ordersContract.get_order(i);
      if (order[0].executed.eq(new BN(0))) {
        this.orders.push(order[0]);
        console.log(`Order ${i} added in the pool`);
      }
    }

    this.lastOrderFetched = numberOfOrders[0].toNumber();
  }

  async checkStatuses() {
    for (let i = 0; i < this.orders.length; i += 1) {
      console.log(`Checking status of order ${this.orders[i].order_id}`);
      const order = await this.ordersContract.get_order(
        this.orders[i].order_id,
      );
      console.log(order[0]);

      if (!order[0].status.eq(new BN(0))) {
        console.log(`remove order ${order[0].order_id}`);
      }
    }
  }

  async checkPrices() {
    for (let i = 0; i < this.orders.length; i += 1) {
      await this.checkPrice(this.orders[i], i);
    }
  }

  async checkPrice(order: any, position: number) {
    console.log(`Checking the price for order ${order.order_id.toString()}`);

    const price = await this.getPrice(order.pool_id, order.token);
    const onePercent = order.price.div(new BN(100));
    const upperBound = order.price.add(onePercent);
    const lowerBound = order.price.sub(onePercent);

    if (price[0].lte(upperBound) && price[0].gte(lowerBound)) {
      await this.executeOrder(order.order_id);
      this.orders.splice(position, 1);
    }
  }

  async getPrice(poolId: number, tokenIn: string) {
    const price = await this.ammContract.get_price(poolId, tokenIn);
    return price;
  }

  async executeOrder(id: number) {
    console.log(`Executing order ${id}`);
    const res = await this.ordersContract.execute_order(id, { maxFee: '0' });
    await this.provider.waitForTransaction(res.transaction_hash);
    console.log(`Order ${id} executed`);
  }
}
