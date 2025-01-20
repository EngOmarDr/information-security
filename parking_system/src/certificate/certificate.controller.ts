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

  @Post('sign-example')
  async postExample(@Body('userId') userId: number) {
  const user = new User();
  const keyPair = await crypto.subtle.generateKey( { 
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048, 
      publicExponent: new Uint8Array([1, 0, 1]), 
      hash: "SHA-256", }, 
      true, ["sign", "verify"]
  );
  const encoder = new TextEncoder(); const dataArray = encoder.encode(null); 
  const signature = await window.crypto.subtle.sign( { 
    name: "RSASSA-PKCS1-v1_5", }, 
    null, dataArray );
  console.log("sljsljf'slj",keyPair);
  return `Certificate generated for user ${userId} with CSR: `;
}
}
