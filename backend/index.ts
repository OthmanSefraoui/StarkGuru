import fs from 'fs';

import { CronJob } from 'cron';
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = 'info';

import Starknet from './lib/Starknet';

const starknet = new Starknet('https://hackathon-3.starknet.io', logger);

let collecting = false;

const job = new CronJob(
  '*/2 * * * * *',
  async () => {
    if (collecting) return;
    collecting = true;
    try {
      await starknet.checkStatuses();
      await starknet.collectOrders();
      await starknet.checkPrices();
    } catch (err) {
      logger.error(err);
    }
    collecting = false;
  },
  null,
  true,
);

job.start();
