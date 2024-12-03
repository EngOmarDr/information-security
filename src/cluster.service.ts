/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */

import * as os from 'os';
import { Injectable } from '@nestjs/common';
import cluster from 'node:cluster';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterService {
    static clusterize(callback: Function): void {
        cluster.schedulingPolicy = cluster.SCHED_RR;

        if(cluster.isPrimary){
            for (let i = 0; i < 1; i++) {
                cluster.fork();
            }
            console.log(`----------------------------------------`)
            console.log(`Welcome`)
            console.log(`----------------------------------------`)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cluster.on('exit', (worker, code, signal) => {
                console.log(`Worker ${worker.process.pid} died. Restarting`);
                cluster.fork();
            })
        } else {
            callback();
        }
    }
}