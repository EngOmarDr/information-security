/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { EncryptionService } from './encryption.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly encryptionService: EncryptionService) { }

  @Get('public-key')
  getServerPublicKey() {
    return { publicKey: this.encryptionService.serverPublicKey.exportKey('public') };
  }

  @Post('create')
  async createUser(@Body() { encUsername, encPassword, publicKey }: { encUsername: string; encPassword: string, publicKey: string }) {
    const user = await this.userService.createUser(encUsername, encPassword, publicKey);
    return { message: 'User created successfully', user: user.id };
  }

  @Post('login')
  async login(
    @Body() { encUsername, encPassword, publicKey }: { encUsername: string; encPassword: string; publicKey: string },
  ) {
    const user = await this.userService.login(encUsername, encPassword, publicKey);
    if (!user) return { message: 'Invalid credentials' };

    return { message: 'Login successfully', user: user.id};

  }

  @Post('deposit')
  async deposit(
    @Body() { userId, amount }: { userId: number; amount: string; },
  ) {
    const newBalance = await this.userService.deposit(userId, amount);
    return newBalance ;
  }

  @Post('withdraw')
  async withdraw(
    @Body() { userId, amount }: { userId: number; amount: string; },
  ) {
    const res = await this.userService.withdraw(userId, amount);
    return res;
  }

  @Post('balance')
  async getBalance(
    @Body() body: { userId: number; }
  ) {
    const { userId } = body;
    const balance = await this.userService.getBalance(userId);
    return balance;
  }
}
