/* eslint-disable prettier/prettier */
/* src/certificate/certificate.controller.ts */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { User } from '../users/user.entity';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post('generate')
  async generateCertificate(@Body('userId') userId: number): Promise<string> {
    const user = new User();
    user.id = userId; // افترض وجود مستخدم مع هذا المعرف
    const certificate = await this.certificateService.createCSR(user);
    return `Certificate generated for user ${userId} with CSR: ${certificate.csr}`;
  }

  @Get('verify/:csr')
  async verifyCertificate(@Param('csr') csr: string): Promise<string> {
    const isValid = await this.certificateService.verifyCertificate(csr);
    return isValid ? 'Certificate is valid' : 'Certificate is invalid';
  }
}
