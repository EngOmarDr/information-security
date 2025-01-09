/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';
import * as helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cluster = require('node:cluster');

const numCPUs = os.cpus().length;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // إعداد CSP لمنع XSS
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    }),
  );


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
  await app.listen(3000);
}
bootstrap();
