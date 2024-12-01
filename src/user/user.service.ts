/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService, // Inject EncryptionService
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const encryptedPassword = this.encryptionService.encryptWithPublicKey(password); // RSA encryption
    const user = new User();
    user.username = username;
    user.encryptedPassword = encryptedPassword;
    user.encryptedBalance = this.encryptionService.encrypt('0'); // AES encryption for balance
    return this.userRepository.save(user);
  }

  async login(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;

    const decryptedPassword = this.encryptionService.decryptWithPrivateKey(user.encryptedPassword); // RSA decryption
    if (decryptedPassword !== password) return null;

    return user;
  }

  async deposit(userId: number, amount: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const balance = parseFloat(this.encryptionService.decrypt(user.encryptedBalance)); // AES decryption for balance
    const newBalance = balance + amount;
    user.encryptedBalance = this.encryptionService.encrypt(newBalance.toString()); // AES encryption
    await this.userRepository.save(user);
  }

  async withdraw(userId: number, amount: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const balance = parseFloat(this.encryptionService.decrypt(user.encryptedBalance)); // AES decryption
    if (balance < amount) return false;

    const newBalance = balance - amount;
    user.encryptedBalance = this.encryptionService.encrypt(newBalance.toString()); // AES encryption
    await this.userRepository.save(user);
    return true;
  }

  async getBalance(userId: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return this.encryptionService.decrypt(user.encryptedBalance); // AES decryption
  }
}
