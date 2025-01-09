/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('parking_slots')
export class ParkingSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slotNumber: string;

  @Column({ default: false })
  isReserved: boolean;

  @Column({ nullable: true })
  reservedBy: string;

  @Column({ nullable: true })
  reservationTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
