import fs from 'fs';

import { Provider, Signer, Contract, Account } from 'starknet';

export default class Starknet {
  provider: Provider;
  signer: Signer;
  account: Account;
  orders: any;
  ordersContract: any;

  constructor(nodeUrl: string, accountContractAddress: string, keyPair: any) {
    this.provider = new Provider({
      baseUrl: nodeUrl,
      feederGatewayUrl: 'feeder_gateway',
      gatewayUrl: 'gateway',
    });
    this.signer = new Signer(keyPair);
    this.account = new Account(this.provider, accountContractAddress, keyPair);

    const compiledOrders = JSON.parse(
      fs.readFileSync('./Orders.json').toString('ascii'),
    );
    this.ordersContract = new Contract(
      compiledOrders.abi,
      accountContractAddress,
      this.account,
    );
  }

  async collectOrders() {
    await this.ordersContract.getOrders();
    // getOrders
    // ListenToNewOrders
  }

  // checkPrice(order: any) {
  //   // get price related to order
  //   // if relevant execute order
  // }
}
