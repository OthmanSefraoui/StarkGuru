import fs from 'fs';

import { CronJob } from 'cron';
import Starknet from './lib/Starknet';

// const keyPair = JSON.parse(
//   fs.readFileSync('./key-pair.json').toString('ascii'),
// );

const starknet = new Starknet('https://hackathon-3.starknet.io');

let collecting = false;

const job = new CronJob(
  '*/2 * * * * *',
  async () => {
    if (collecting) return;
    collecting = true;
    try {
      // await starknet.checkStatuses();
      await starknet.collectOrders();
      await starknet.checkPrices();
    } catch (err) {
      console.log(err);
    }
    collecting = false;
  },
  null,
  true,
);

job.start();
