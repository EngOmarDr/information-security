import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-ctr'; // خوارزمية التشفير

  encrypt(data: string, sessionKey: string): string {
    const iv = crypto.randomBytes(16); // IV بطول 16 بايت
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(sessionKey, 'hex'),
      iv,
    );

    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(encryptedData: string, sessionKey: string): string {
    const [ivHex, encryptedHex] = encryptedData.split(':');

    // تحقق من أن IV موجود وبالطول الصحيح
    if (!ivHex || Buffer.from(ivHex, 'hex').length !== 16) {
      throw new BadRequestException('Invalid or missing initialization vector (IV).');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(sessionKey, 'hex'),
      iv,
    );

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
