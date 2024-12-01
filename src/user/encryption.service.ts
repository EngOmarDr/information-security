/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class EncryptionService {
  private readonly symmetricKey = process.env.SYMMETRIC_KEY || '12345678901234567890123456789012';
  private readonly algorithm = 'aes-256-cbc';
  private readonly privateKey = fs.readFileSync('private.pem', 'utf8');
  private readonly publicKey = fs.readFileSync('public.pem', 'utf8');
  

  // Symmetric encryption (AES)
  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.symmetricKey, Buffer.alloc(16, 0));
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }

  decrypt(data: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.symmetricKey, Buffer.alloc(16, 0));
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  }

  // Asymmetric encryption (RSA)
  encryptWithPublicKey(data: string): string {
    const buffer = Buffer.from(data, 'utf8');
    return crypto.publicEncrypt(this.publicKey, buffer).toString('base64');
  }

  decryptWithPrivateKey(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(this.privateKey, buffer);
    return decrypted.toString('utf8');
  }
}
