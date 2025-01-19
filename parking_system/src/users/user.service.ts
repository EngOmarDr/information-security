import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  async generateToken(user: User): Promise<string> {
    const payload = { userId: user.id, userType: user.userType };
    return this.jwtService.sign(payload);
  }
}
