/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('public-key')
  getServerPublicKey() {
    return { publicKey: this.userService.getServerPublicKey() };
  }

  @Post('create')
  async createUser(@Body() { username, password }: { username: string; password: string }) {
    const user = await this.userService.createUser(username, password);
    return { message: 'User created successfully', userId: user.id };
  }

  @Post('login')
  async login(
    @Body() { username, password, clientPublicKey }: { username: string; password: string; clientPublicKey: string },
  ) {
    const user = await this.userService.login(username, password);
    if (!user) return { message: 'Invalid credentials' };

    const encryptedResponse = this.userService.asymmetricEncrypt(
      JSON.stringify({ message: 'Login successful', userId: user.id }),
      clientPublicKey,
    );

    return { encryptedResponse };
  }

  @Post('deposit')
  async deposit(
    @Body() { userId, amount, clientPublicKey }: { userId: number; amount: number; clientPublicKey: string },
  ) {
    await this.userService.deposit(userId, amount);
    const encryptedResponse = this.userService.asymmetricEncrypt(
      'Deposit successful',
      clientPublicKey,
    );
    return { encryptedResponse };
  }

  @Post('withdraw')
  async withdraw(
    @Body() { userId, amount, clientPublicKey }: { userId: number; amount: number; clientPublicKey: string },
  ) {
    const success = await this.userService.withdraw(userId, amount);
    const encryptedResponse = this.userService.asymmetricEncrypt(
      success ? 'Withdrawal successful' : 'Insufficient balance',
      clientPublicKey,
    );
    return { encryptedResponse };
  }

  @Post('balance')
  async getBalance(
    @Body() body: { userId: number; clientPublicKey: string }
  ) {
    const { userId, clientPublicKey } = body;
    const balance = await this.userService.getBalance(userId);
    const encryptedResponse = this.userService.asymmetricEncrypt(balance, clientPublicKey);
    return { encryptedResponse };
  }
}
