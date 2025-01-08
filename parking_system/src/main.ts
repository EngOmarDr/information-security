/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';
const cluster = require('node:cluster');

const numCPUs = os.cpus().length;

async function bootstrap() {
  cluster.schedulingPolicy = cluster.SCHED_RR;

  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs - numCPUs + 1; i++) {
      cluster.fork();
    }
    console.log(`----------------------------------------`);
    console.log(`Welcome`);
    console.log(`----------------------------------------`);
  } else {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
  }
}
bootstrap();
