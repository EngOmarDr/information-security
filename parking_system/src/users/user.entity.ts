/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Certificate } from '../certificate/certificate.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ type: 'enum', enum: ['employee', 'visitor'], nullable: false })
  userType: 'employee' | 'visitor';

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  carPlate: string;

  @Column({ nullable: false })
  password: string;
  
  @Column({ nullable: true })
  publicKey: string;
  
  @Column({ nullable: true,type: 'varchar', length: 500  })
  sessionKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Certificate, (certificate) => certificate.user, { cascade: true })
  certificates: Certificate[]; // العلاقة مع كيان Certificate
}
