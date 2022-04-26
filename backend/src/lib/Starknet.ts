import { BN } from 'bn.js';
import * as log4js from 'log4js';
import { ec, Provider, Signer, Contract, Account } from 'starknet';

const compiledAmm = require('../../../contracts/artifacts/amm.json');
const compiledOrders = require('../../../contracts/artifacts/limit_orders.json');

export default class Starknet {
  logger: log4js.Logger;
  orders: any[];
  lastOrderFetched: number;
  provider: Provider;
  ammContract: Contract;
  ordersContract: Contract;

  constructor(nodeUrl: string, logger: any, config: any, privateKey: string) {
    const { accountAddress, ammAddress, ordersAddress } = config;

    this.logger = logger;
    this.orders = [];
    this.lastOrderFetched = 0;

    this.provider = new Provider({
      baseUrl: nodeUrl,
      feederGatewayUrl: 'feeder_gateway',
      gatewayUrl: 'gateway',
    });

    const recover = ec.ec.keyFromPrivate(privateKey);
    const signer = new Signer(recover);
    const account = new Account(this.provider, accountAddress, signer);

    this.ammContract = new Contract(compiledAmm.abi, ammAddress, account);
    this.ordersContract = new Contract(
      compiledOrders.abi,
      ordersAddress,
      account,
    );
  }

  async collectOrders() {
    const numberOfOrders = await this.ordersContract.get_number_of_orders();

    this.logger.info(
      `${numberOfOrders[0].sub(new BN(this.lastOrderFetched))} new order(s)`,
    );

    for (
      let i = this.lastOrderFetched + 1;
      i <= numberOfOrders[0].toNumber();
      i += 1
    ) {
      const order = await this.ordersContract.get_order(i);
      if (order[0].order_status.eq(new BN(0))) {
        this.orders.push(order[0]);
        this.logger.info(`Order ${i} added in the pool`);
      }
    }

    this.lastOrderFetched = numberOfOrders[0].toNumber();
  }

  async checkStatuses() {
    for (let i = 0; i < this.orders.length; i += 1) {
      this.logger.info(`Checking status of order ${this.orders[i].order_id}`);
      const order = await this.ordersContract.get_order(
        this.orders[i].order_id,
      );

      if (!order[0].order_status.eq(new BN(0))) {
        this.logger.info(`Remove order ${order[0].order_id} from pool`);
        this.orders.splice(i, 1);
      }
    }
  }

  async checkPrices() {
    for (let i = 0; i < this.orders.length; i += 1) {
      await this.checkPrice(this.orders[i]);
    }
  }

  async checkPrice(order: any) {
    this.logger.info(
      `Checking the price for order ${order.order_id.toString()}`,
    );

    const price = await this.getPrice(order.pool_id, order.token);
    const onePercent = order.price.div(new BN(100));
    const upperBound = order.price.add(onePercent);
    const lowerBound = order.price.sub(onePercent);

    if (price[0].lte(upperBound) && price[0].gte(lowerBound)) {
      await this.executeOrder(order.order_id);
    }
  }

  async getPrice(poolId: number, tokenIn: string) {
    const price = await this.ammContract.get_price(poolId, tokenIn);
    return price;
  }

  async executeOrder(id: number) {
    this.logger.info(`Executing order ${id}`);
    const res = await this.ordersContract.execute_order(id, { maxFee: '0' });
    await this.provider.waitForTransaction(res.transaction_hash);
    this.logger.info(`Order ${id} executed`);
  }
}
