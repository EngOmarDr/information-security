/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { DigitalSignatureService } from '../activity/digitalSignature.service';
import { ActivityLogService } from '../activity/activity-log.service';
import { HelperService } from 'src/helpers/heper.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Controller('payment')
export class PaymentController {
constructor(
    private readonly paymentService: PaymentService,
    private readonly digitalSignatureService: DigitalSignatureService,
    private readonly activityLogService: ActivityLogService,
    private readonly helper: HelperService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    
  ) {}

  @Post('process')
  async processPayment(@Body() body: any) {
    const { encData, id } = body;
    console.log(body);
    const user = await this.userRepository.findOne({where: {id: id} });
    var is_verified = this.helper.verifySignature(user.publicKey,body.signature,body.data);
    console.log(is_verified);

    if (!id || !encData) {
      throw new Error('Encrypted Data and id are required.');
    }

    // معالجة الدفع
    const paymentResult = await this.paymentService.processPayment(encData, id);

    // توليد توقيع رقمي للبيانات
    const dataToSign = JSON.stringify(paymentResult);
    const signature = this.digitalSignatureService.generateSignature(dataToSign);

    // تسجيل العملية
    await this.activityLogService.logActivity('Payment', dataToSign, signature);
    return { paymentResult, signature };
  }
}
