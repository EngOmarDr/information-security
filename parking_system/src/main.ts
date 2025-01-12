/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';
import * as helmet from 'helmet';
const cluster = require('node:cluster');

const numCPUs = os.cpus().length;

async function bootstrap() {
  if (cluster.isPrimary) {
    // إذا كانت هذه العملية هي العملية الرئيسية، نقوم بإنشاء عمليات ثانوية
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    console.log('----------------------------------------');
    console.log('Welcome');
    console.log('----------------------------------------');
    
    // يمكنك إضافة حدث للإبلاغ عند انتهاء أي من العمليات الثانوية
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
    
  } else {
    // إذا كانت هذه عملية ثانوية، نقوم بإنشاء التطبيق والاستماع على المنفذ
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

    await app.listen(process.env.PORT ?? 3000);
  }
}

bootstrap();
