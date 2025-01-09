/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ type: 'text' })
  data: string;

  @Column({ type: 'text' })
  signature: string;

  @CreateDateColumn()
  timestamp: Date;
}
