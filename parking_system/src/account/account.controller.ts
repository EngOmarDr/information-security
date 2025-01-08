import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post('register')
    async register(@Body() accountData: Partial<Account>): Promise<Account> {
        return this.accountService.createAccount(accountData);
    }

    @Post('login')
    async login(
        @Body('phoneNumber') phoneNumber: string,
        @Body('password') password: string,
    ): Promise<string> {
        return this.accountService.login(phoneNumber, password);
    }
}
