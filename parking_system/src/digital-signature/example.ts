/* eslint-disable prettier/prettier */
/* src/certificate/certificate.controller.ts */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { User } from '../users/user.entity';

@Controller('certificates')
export class CertificateController {
  constructor() {

  }

    @Post('sign-exmaple')
    async generateCertificate(@Body('userId') userId: number) {
    const user = new User();
    const keyPair = await window.crypto.subtle.generateKey( { 
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048, 
        publicExponent: new Uint8Array([1, 0, 1]), 
        hash: "SHA-256", }, 
        true, ["sign", "verify"]
    );
    console.log(keyPair);
    return `Certificate generated for user ${userId} with CSR: `;
  }


}
