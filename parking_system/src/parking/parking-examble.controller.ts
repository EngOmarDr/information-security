/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { DigitalSignatureService } from '../activity/digitalSignature.service';
import { ActivityLogService } from '../activity/activity-log.service';

@Controller('parking')
export class ParkingController {
  constructor(
    private readonly digitalSignatureService: DigitalSignatureService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  @Post('reserve')
  async reserveParking(@Body() body: any) {
    const { parkingSlot, time } = body;

    if (!parkingSlot || !time) {
      throw new Error('Parking slot and time are required.');
    }

    // محاكاة عملية الحجز
    const reservationData = { parkingSlot, time, status: 'Reserved' };

    // توليد توقيع رقمي
    const dataToSign = JSON.stringify(reservationData);
    const signature = this.digitalSignatureService.generateSignature(dataToSign);

    // تسجيل العملية
    await this.activityLogService.logActivity('Parking Reservation', dataToSign, signature);

    return { reservationData, signature };
  }
}
