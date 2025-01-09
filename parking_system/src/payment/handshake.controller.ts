/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

@Controller('handshake')
export class HandshakeController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('get-public-key')
  getPublicKey() {
    // إرسال المفتاح العام للسيرفر إلى العميل
    return { publicKey: this.encryptionService.getServerPublicKey() };
  }
}
