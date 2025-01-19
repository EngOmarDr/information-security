/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
const NodeRSA = require('node-rsa');

@Injectable()
export class EncryptionService {
  private readonly rsaKeyPair: crypto.KeyPairSyncResult<string, string>;

  constructor() {
    // توليد مفتاحي RSA للسيرفر عند التهيئة
    this.rsaKeyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
  }

  getServerPublicKey(): string {
    return this.rsaKeyPair.publicKey;
  }

  decryptWithPrivateKey(encryptedData: string): string {
    try {
      return crypto
        .privateDecrypt(
          {
            key: this.rsaKeyPair.privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          Buffer.from(encryptedData, 'base64'),
        )
        .toString();
    } catch (error) {
      console.error('Decryption error details:', error);
      throw new Error('Failed to decrypt session key: ' + error.message);
    }
  }

  encryptWithPublicKey(publicKey: string, data: string): string {
    return crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(data),
      )
      .toString('base64');
  }

  encryptWithAES(data: string, sessionKey: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-ctr',
      Buffer.from(sessionKey, 'hex'),
      iv,
    );
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptWithAES(encryptedData: string, sessionKey: string): string {
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-ctr',
      Buffer.from(sessionKey, 'hex'),
      iv,
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString();
  }

  decrpytSessionKey(encSession: String, privateKey: String) {
    var dec = new NodeRSA(privateKey);
    const res = dec.decrypt(encSession, 'utf8');
    return res;
  }
  
  decrpytDataWithSession(encSession: String, privateKey: String) {
    console.log('-----------------------');
    console.log(encSession);
    console.log(privateKey);
    
    var dec = new NodeRSA(privateKey);
    const res = dec.decrypt(encSession, 'utf8');
    console.log(res);
    return res;
  }

   decrypt(encryptedData:String, sessionKey:String) {
    const [ivHex, encryptedHex] = encryptedData.split(':');

    // تحقق من أن IV موجود وبالطول الصحيح
    if (!ivHex || Buffer.from(ivHex, 'hex').length !== 16) {
        throw new BadRequestException('Invalid or missing initialization vector (IV).');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
        'aes-256-ctr',
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
