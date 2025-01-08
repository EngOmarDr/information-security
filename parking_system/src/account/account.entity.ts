import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum UserType {
    EMPLOYEE = 'EMPLOYEE',
    VISITOR = 'VISITOR',
}

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @Column()
    @IsNotEmpty()
    @IsEnum(UserType)
    userType: UserType;

    @Column({ unique: true })
    @IsNotEmpty()
    phoneNumber: string;

    @Column({ unique: true })
    @IsNotEmpty()
    carPlate: string;

    @Column()
    @IsNotEmpty()
    password: string;
}
