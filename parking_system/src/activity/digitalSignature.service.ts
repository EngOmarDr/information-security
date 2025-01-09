/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class DigitalSignatureService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor() {
    // توليد مفتاحي التوقيع الرقمي للسيرفر
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  generateSignature(data: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey, 'base64');
  }

  verifySignature(data: string, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
  }
}
