import fs from 'fs';

import { CronJob } from 'cron';
import Starknet from './lib/Starknet';

import accountContract from './accountContract';

const keyPair = JSON.parse(
  fs.readFileSync('./key-pair.json').toString('ascii'),
);

const starknet = new Starknet(
  'https://hackathon-3.starknet.io',
  accountContract,
  keyPair,
);

const init = async () => {
  await starknet.collectOrders();
};

const job = new CronJob(
  '* * * * * *',
  () => {
    console.log('Job is running');
    starknet.orders.forEach(async (order) => {
      await starknet.checkPrice(order);
    });
  },
  null,
  true,
);

init();
job.start();

// starknet.getPrice(
//   1,
//   '1024954592621139756096955849939395900823875067926016197778070902863251962652',
// );
