/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() { username, password }: { username: string; password: string }) {
    const user = await this.userService.createUser(username, password);
    return { message: 'User created successfully', userId: user.id };
  }

  @Post('login')
  async login(@Body() { username, password }: { username: string; password: string }) {
    const user = await this.userService.login(username, password);
    if (!user) return { message: 'Invalid credentials' };
    return { message: 'Login successful', userId: user.id };
  }

  @Post('deposit')
  async deposit(@Body() { userId, amount }: { userId: number; amount: number }) {
    await this.userService.deposit(userId, amount);
    return { message: 'Deposit successful' };
  }

  @Post('withdraw')
  async withdraw(@Body() { userId, amount }: { userId: number; amount: number }) {
    const success = await this.userService.withdraw(userId, amount);
    return success ? { message: 'Withdrawal successful' } : { message: 'Insufficient balance' };
  }

  @Get('balance/:userId')
  async getBalance(@Param('userId') userId: number) {
    const balance = await this.userService.getBalance(userId);
    return { balance };
  }
}
