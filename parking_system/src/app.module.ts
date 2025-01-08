/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'parking_system_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AccountModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
