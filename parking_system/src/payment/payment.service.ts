/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    private readonly encryptionService: EncryptionService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private readonly privateKey: String = `-----BEGIN RSA PRIVATE KEY-----
MIIBPAIBAAJBANH1eXM9VIrl7PQG5m47l4Hgdx4iPOjbQWV/67/4kS2o1oKgXuYX
qo34fTJszsRCVP+virQOA0xx6p51ucoOBgkCAwEAAQJAOG0dZ8Aq0W17ohWcpjFz
xV7bBIk1D2ulhq67YAtgkQFbJP9CzZngKSeD7CKZZEByPfRq+G5HQLeCVlUlf+Tb
AQIhAPuW0kKH769I94MudNhYtYH+3+RO5Q0Xv/fMQsntWy2pAiEA1aPPCz92qVKG
m5LwZZktS316+Me3YKTGmgBxAK2dkWECIQDUb7O27eWbUrd8kzuierU4wSf4Ng3+
kjFMYbN7oeo9kQIhAMM2Rz3T462chvspLRjo+oZ8Rh2FAH8CkaauuJMSEWSBAiEA
md2CQw1BuwPNt3MOuRdmz7NgdxkJGcmjx/8bRMSOl1Y=
-----END RSA PRIVATE KEY-----`;

  async processPayment(encData: string, id: number): Promise<any> {
    // فك تشفير مفتاح الجلسة باستخدام المفتاح الخاص
    const user = await this.userRepository.findOne({ where: { id } });
    
    const session = this.encryptionService.decrpytSessionKey(
      user.sessionKey,
      this.privateKey,
    );
    
    const data = this.encryptionService.decrypt(
      encData,
      session,
    );
    const data2 = JSON.parse(data)
    
    // فك تشفير بيانات الدفع باستخدام مفتاح الجلسة
    // const paymentData = JSON.parse(
    //   this.encryptionService.decryptWithAES(encryptedPaymentData, sessionKey),
    // );

    // const { amount, cardNumber, expirationDate } = paymentData;

    // معالجة الدفع (محاكاة)
    if (data2.amount > 0) {
      return { success: true, message: 'Payment processed successfully' };
    }
    // return data;

    return { success: false, message: 'Invalid payment details' };
  }
}
