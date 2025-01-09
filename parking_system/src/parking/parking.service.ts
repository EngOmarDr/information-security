/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSlot } from './parking.entity';
import { EncryptionService } from './encryption.service';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingRepository: Repository<ParkingSlot>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async reserveSlot(encryptedData: string, sessionKey: string): Promise<any> {
    // فك تشفير البيانات باستخدام المفتاح المتفق عليه
    const decryptedData = JSON.parse(
      this.encryptionService.decrypt(encryptedData, sessionKey),
    );

    const { slotNumber, time, reservedBy } = decryptedData;

    // التحقق من البيانات
    const slot = await this.parkingRepository.findOne({ where: { slotNumber } });

    if (!slot) {
      throw new BadRequestException('Parking slot not found.');
    }

    if (slot.isReserved) {
      throw new BadRequestException('Parking slot already reserved.');
    }

    // تحديث قاعدة البيانات
    slot.isReserved = true;
    slot.reservedBy = reservedBy;
    slot.reservationTime = new Date(time);
    await this.parkingRepository.save(slot);

    // تشفير الرد
    const response = { message: 'Reservation confirmed', slotNumber, time };
    const encryptedResponse = this.encryptionService.encrypt(
      JSON.stringify(response),
      sessionKey,
    );

    return { encryptedResponse };
  }
}
