/* eslint-disable prettier/prettier */
/* src/certificate/certificate.entity.ts */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  csr: string; // طلب الشهادة (Certificate Signing Request)

  @Column()
  publicKey: string; // المفتاح العام المرتبط بالشهادة

  @Column()
  issuedBy: string; // الجهة الموثوقة (CA)

  @Column()
  validFrom: Date; // تاريخ البدء

  @Column()
  validTo: Date; // تاريخ الانتهاء

  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  user: User; // ربط الشهادة بالمستخدم
}
