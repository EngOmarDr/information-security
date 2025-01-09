/* eslint-disable prettier/prettier */
/* src/certificate/certificate.service.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './certificate.entity';
import { User } from '../users/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
  ) {}

  async createCSR(user: User): Promise<Certificate> {
    const csr = crypto.randomBytes(256).toString('base64'); // تمثيل بسيط لطلب شهادة
    const publicKey = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    }).publicKey.export({ type: 'spki', format: 'pem' });

    const certificate = this.certificateRepository.create({
        csr,
        publicKey: publicKey.toString('base64'), // تحويل Buffer إلى string مشفر
        issuedBy: 'TrustedCA', // جهة الإصدار
        validFrom: new Date(),
        validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        user,
      });

    return this.certificateRepository.save(certificate);
  }

  async verifyCertificate(csr: string): Promise<boolean> {
    const certificate = await this.certificateRepository.findOne({ where: { csr } });
    if (!certificate) {
      return false;
    }

    // تحقق إضافي (يمكنك إضافة توقيع رقمي هنا)
    return certificate.validTo > new Date();
  }
}
