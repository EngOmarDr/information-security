/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { HelperService } from 'src/helpers/heper.service';

@Controller('parking')
export class ParkingController {
  constructor(
    private readonly parkingService: ParkingService,
    private readonly helper: HelperService,
  ) {}

  @Post('reserve')
  async reserve(@Body() body: any) {
    const { encryptedData, sessionKey } = body;
    // this.helper.verifySignature()
    if (!encryptedData || !sessionKey) {
      throw new BadRequestException('Encrypted data and session key are required.');
    }

    return this.parkingService.reserveSlot(encryptedData, sessionKey);
  }
}