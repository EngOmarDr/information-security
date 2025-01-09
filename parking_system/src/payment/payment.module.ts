/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { EncryptionService } from './encryption.service';
import { HandshakeController } from './handshake.controller';

@Module({
  controllers: [PaymentController, HandshakeController],
  providers: [PaymentService, EncryptionService],
})
export class PaymentModule {}
