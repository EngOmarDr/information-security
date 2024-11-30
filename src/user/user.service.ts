/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private readonly symmetricKey = '12345678901234567890123456789012'; // 32 حرفًا
  private readonly algorithm = 'aes-256-cbc';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private encrypt(data: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.symmetricKey,
      Buffer.alloc(16, 0),
    );
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }

  private decrypt(data: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.symmetricKey,
      Buffer.alloc(16, 0),
    );
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  }

  async createUser(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.encryptedPassword = this.encrypt(password);
    user.encryptedBalance = this.encrypt('0'); // البداية برصيد 0
    return this.userRepository.save(user);
  }

  async login(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;

    const decryptedPassword = this.decrypt(user.encryptedPassword);
    if (decryptedPassword !== password) return null;

    return user;
  }

  async deposit(userId: number, amount: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const balance = parseFloat(this.decrypt(user.encryptedBalance));
    const newBalance = balance + amount;
    user.encryptedBalance = this.encrypt(newBalance.toString());
    await this.userRepository.save(user);
  }

  async withdraw(userId: number, amount: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const balance = parseFloat(this.decrypt(user.encryptedBalance));
    if (balance < amount) return false;

    const newBalance = balance - amount;
    user.encryptedBalance = this.encrypt(newBalance.toString());
    await this.userRepository.save(user);
    return true;
  }

  async getBalance(userId: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return this.decrypt(user.encryptedBalance);
  }
}
