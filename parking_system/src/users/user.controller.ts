/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException, HttpCode } from '@nestjs/common';
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

    const user = await this.userService.createUser({
      fullName,
      userType,
      phoneNumber,
      carPlate,
      password,
    });

    const token = await this.userService.generateToken(user);
    

    return { message: 'Registration successful', token };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: any) {
    const { fullName, password } = body;

    if (!fullName || !password) {
      throw new BadRequestException('fullName and password are required.');
    }

    const user = await this.userService.validateUser(fullName, password);

    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    const token = await this.userService.generateToken(user);

    return { message: 'Login successful', token };
  }
}
