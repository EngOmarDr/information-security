/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

@Injectable()
export class PaymentService {
  constructor(private readonly encryptionService: EncryptionService) {}

  processPayment(encryptedSessionKey: string, encryptedPaymentData: string): any {
    // فك تشفير مفتاح الجلسة باستخدام المفتاح الخاص
    const sessionKey = this.encryptionService.decryptWithPrivateKey(encryptedSessionKey);

    // فك تشفير بيانات الدفع باستخدام مفتاح الجلسة
    const paymentData = JSON.parse(this.encryptionService.decryptWithAES(encryptedPaymentData, sessionKey));

    const { amount, cardNumber, expirationDate } = paymentData;

    // معالجة الدفع (محاكاة)
    if (amount > 0) {
      return { success: true, message: 'Payment processed successfully' };
    }

    return { success: false, message: 'Invalid payment details' };
  }
}
