/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: {
    fullName: string;
    userType: 'employee' | 'visitor';
    phoneNumber: string;
    carPlate: string;
    password: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async validateUser(phoneNumber: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }
}
