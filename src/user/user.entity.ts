/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  encryptedPassword: string;

  @Column({ type: 'text' , default: '0' })
  encryptedBalance: string;

  @Column()
  publicKey: string;
}
