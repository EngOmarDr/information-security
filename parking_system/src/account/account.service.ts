/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) { }

    async createAccount(accountData: Partial<Account>): Promise<Account> {
        const { phoneNumber, carPlate, password } = accountData;

        // التحقق من البيانات
        const existingAccount = await this.accountRepository.findOneBy([
            { phoneNumber },
            { carPlate },
        ]);
        if (existingAccount) {
            throw new BadRequestException('Phone number or car plate already exists');
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);
        accountData.password = hashedPassword;

        // إنشاء الحساب
        const newAccount = this.accountRepository.create(accountData);
        return this.accountRepository.save(newAccount);
    }

    async login(phoneNumber: string, password: string): Promise<string> {
        const account = await this.accountRepository.findOneBy({ phoneNumber });
        if (!account) {
            throw new NotFoundException('Account not found');
        }

        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        return `Welcome ${account.fullName}`;
    }
}
