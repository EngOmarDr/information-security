/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { fullName, userType, phoneNumber, carPlate, password } = body;

    if (!fullName || !userType || !phoneNumber || !carPlate || !password) {
      throw new BadRequestException('All fields are required.');
    }

    if (!['employee', 'visitor'].includes(userType)) {
      throw new BadRequestException('Invalid user type.');
    }

    return this.userService.createUser({
      fullName,
      userType,
      phoneNumber,
      carPlate,
      password,
    });
  }

  @Post('login')
  async login(@Body() body: any) {
    const { phoneNumber, password } = body;

    if (!phoneNumber || !password) {
      throw new BadRequestException('Phone number and password are required.');
    }

    const user = await this.userService.validateUser(phoneNumber, password);

    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    return { message: 'Login successful', user };
  }
}
