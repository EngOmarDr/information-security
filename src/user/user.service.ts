/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as fs from 'fs';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UserService {
  private readonly serverPublicKey: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService
  ) {
    this.serverPublicKey = fs.readFileSync('public.pem', { encoding: 'utf8' })
  }

  // استرجاع المفتاح العام للخادم
  getServerPublicKey(): string {
    return this.serverPublicKey;
  }

  async createUser(encUsername: string, encPassword: string, publicKey: string): Promise<User> {
    const password = this.encryptionService.asymmetricDecrypt(encPassword)
    const username = this.encryptionService.asymmetricDecrypt(encUsername)

    // save user in database with symmetric encrypt
    const user = new User();
    user.username = username;
    user.encryptedPassword = this.encryptionService.symmetricEncrypt(password);
    user.encryptedBalance = this.encryptionService.symmetricEncrypt('0'); // البداية برصيد 0
    user.publicKey = publicKey
    return this.userRepository.save(user);
  }

  async login(encUsername: string, encPassword: string, publicKey: string): Promise<User | null> {
    const password = this.encryptionService.asymmetricDecrypt(encPassword)
    const username = this.encryptionService.asymmetricDecrypt(encUsername)
      console.log(password);
      console.log(username);
      
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;

    const decryptedPassword = this.encryptionService.symmetricDecrypt(user.encryptedPassword);
    if (decryptedPassword !== password) return null;

    user.publicKey = publicKey;
    this.userRepository.save(user)

    return user;
  }

  async deposit(userId: number, amount: string): Promise<Object> {
    const deAmount = parseFloat(this.encryptionService.asymmetricDecrypt(amount))

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return { message: "user doesn't exist" }
    }
    const balance = parseFloat(this.encryptionService.symmetricDecrypt(user.encryptedBalance));
    const newBalance = balance + deAmount;
    user.encryptedBalance = this.encryptionService.symmetricEncrypt(newBalance.toString());
    await this.userRepository.save(user);

    return { balance: this.encryptionService.asymmetricEncrypt(newBalance.toString(), user.publicKey) }
  }

  async withdraw(userId: number, amount: string): Promise<Object> {
    const deAmount = parseFloat(this.encryptionService.asymmetricDecrypt(amount))

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return { message: 'user does not exsits' }
    }
    const balance = parseFloat(this.encryptionService.symmetricDecrypt(user.encryptedBalance));
    if (balance < deAmount) return { message: 'no moeny ' };

    const newBalance = balance - deAmount;
    user.encryptedBalance = this.encryptionService.symmetricEncrypt(newBalance.toString());
    await this.userRepository.save(user);

    return { messae: 'Withdrawal successful' };
  }

  async getBalance(userId: number): Promise<Object> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const balance = this.encryptionService.symmetricDecrypt(user.encryptedBalance)

    const balanceAsy = this.encryptionService.asymmetricEncrypt(balance, user.publicKey)
    return { balanceAsy };
  }
}
