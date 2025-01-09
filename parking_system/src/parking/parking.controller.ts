/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('reserve')
  async reserve(@Body() body: any) {
    const { encryptedData, sessionKey } = body;

    if (!encryptedData || !sessionKey) {
      throw new BadRequestException('Encrypted data and session key are required.');
    }

    return this.parkingService.reserveSlot(encryptedData, sessionKey);
  }
}
