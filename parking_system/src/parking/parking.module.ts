/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlot } from './parking.entity';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSlot])],
  controllers: [ParkingController],
  providers: [ParkingService, EncryptionService],
})
export class ParkingModule {}
