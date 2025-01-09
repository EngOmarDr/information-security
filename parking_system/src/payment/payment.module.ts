/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { EncryptionService } from './encryption.service';
import { HandshakeController } from './handshake.controller';
import { ActivityLogService } from '../activity/activity-log.service';
import { DigitalSignatureService } from '../activity/digitalSignature.service';
import { ActivityLogModule } from '../activity/activity-log.module';

@Module({
    imports: [ActivityLogModule],
  controllers: [PaymentController, HandshakeController],
  providers: [PaymentService, EncryptionService, DigitalSignatureService, ActivityLogService],
})
export class PaymentModule {}
