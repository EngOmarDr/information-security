/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';
import * as helmet from 'helmet';
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
    const fs = require('fs');
    const keyFile = fs.readFileSync(__dirname + '/../key.pem');
    const certFile = fs.readFileSync(__dirname + '/../cert.pem');

    const app = await NestFactory.create(AppModule,
    );
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

    await app.listen(process.env.PORT ?? 3000);
  }
}

bootstrap();
