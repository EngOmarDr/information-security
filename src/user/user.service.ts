/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';
import NodeRSA from 'node-rsa';

@Injectable()
export class UserService {
  private readonly symmetricKey = '12345678901234567890123456789012'; // 32 حرفًا
  private readonly algorithm = 'aes-256-cbc';

  private readonly serverKey = new NodeRSA({ b: 512 }); // توليد مفتاح الخادم
  private readonly serverPublicKey = this.serverKey.exportKey('public');
  private readonly serverPrivateKey = this.serverKey.exportKey('private');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // تشفير متناظر
  private symmetricEncrypt(data: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.symmetricKey,
      Buffer.alloc(16, 0),
    );
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }

  private symmetricDecrypt(data: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.symmetricKey,
      Buffer.alloc(16, 0),
    );
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  }

  // تشفير غير متناظر
  public asymmetricEncrypt(data: string, clientPublicKey: string): string {
    const clientKey = new NodeRSA(clientPublicKey);
    return clientKey.encrypt(data, 'base64');
  }

  public asymmetricDecrypt(data: string): string {
    return this.serverKey.decrypt(data, 'utf8');
  }

  // استرجاع المفتاح العام للخادم
  getServerPublicKey(): string {
    return this.serverPublicKey;
  }

  async createUser(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.encryptedPassword = this.symmetricEncrypt(password);
    user.encryptedBalance = this.symmetricEncrypt('0'); // البداية برصيد 0
    return this.userRepository.save(user);
  }

  async login(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;

    const decryptedPassword = this.symmetricDecrypt(user.encryptedPassword);
    if (decryptedPassword !== password) return null;

    return user;
  }

  async deposit(userId: number, amount: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const balance = parseFloat(this.symmetricDecrypt(user.encryptedBalance));
    const newBalance = balance + amount;
    user.encryptedBalance = this.symmetricEncrypt(newBalance.toString());
    await this.userRepository.save(user);
  }

  async withdraw(userId: number, amount: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const balance = parseFloat(this.symmetricDecrypt(user.encryptedBalance));
    if (balance < amount) return false;

    const newBalance = balance - amount;
    user.encryptedBalance = this.symmetricEncrypt(newBalance.toString());
    await this.userRepository.save(user);
    return true;
  }

  async getBalance(userId: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return this.symmetricDecrypt(user.encryptedBalance);
  }
}
