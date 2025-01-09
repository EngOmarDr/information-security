/* eslint-disable prettier/prettier */
/* src/profile/profile.entity.ts */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // اسم المستخدم

  @Column({ nullable: true })
  bio: string; // وصف المستخدم
}
