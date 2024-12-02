/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    /// this is for postgress
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '23177',
      database: 'atm_db',
      entities: [User],
      synchronize: true,
    }),
    /// this is for mysql don't remove it
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'test',
    //   entities: [User],
    //   synchronize: true,
    // }),
    UserModule,
  ],
})
export class AppModule {}
