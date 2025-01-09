/* eslint-disable prettier/prettier */
/* src/certificate/certificate.module.ts */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate])],
  providers: [CertificateService],
  controllers: [CertificateController],
})
export class CertificateModule {}
