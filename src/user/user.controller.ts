/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { EncryptionService } from './encryption.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly encryptionService: EncryptionService) { }

  @Get('public-key')
  getServerPublicKey() {
    return { publicKey: this.userService.getServerPublicKey() };
  }

  @Post('create')
  async createUser(@Body() { username, password, publicKey }: { username: string; password: string, publicKey: string }) {
    const user = await this.userService.createUser(username, password, publicKey);
    return { message: 'User created successfully', user: user.id, publicKeyServer: this.encryptionService.serverPublicKey };
  }

  @Post('login')
  async login(
    @Body() { username, password, publicKey }: { username: string; password: string; publicKey: string },
  ) {
    const user = await this.userService.login(username, password, publicKey);
    if (!user) return { message: 'Invalid credentials' };

    return { message: 'Login successfully', user: user.id, publicKeyServer: this.encryptionService.serverPublicKey };

  }

  @Post('deposit')
  async deposit(
    @Body() { userId, amount }: { userId: number; amount: string; },
  ) {
    const newBalance = await this.userService.deposit(userId, amount);
    return { newBalance };
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
