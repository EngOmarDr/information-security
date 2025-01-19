/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Controller('handshake')
export class HandshakeController {
  constructor(
    private readonly encryptionService: EncryptionService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

  ) {}

  private readonly publicKey: String = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANH1eXM9VIrl7PQG5m47l4Hgdx4iPOjb
QWV/67/4kS2o1oKgXuYXqo34fTJszsRCVP+virQOA0xx6p51ucoOBgkCAwEAAQ==
-----END PUBLIC KEY-----`;

  private readonly privateKey: String = `-----BEGIN RSA PRIVATE KEY-----
MIIBPAIBAAJBANH1eXM9VIrl7PQG5m47l4Hgdx4iPOjbQWV/67/4kS2o1oKgXuYX
qo34fTJszsRCVP+virQOA0xx6p51ucoOBgkCAwEAAQJAOG0dZ8Aq0W17ohWcpjFz
xV7bBIk1D2ulhq67YAtgkQFbJP9CzZngKSeD7CKZZEByPfRq+G5HQLeCVlUlf+Tb
AQIhAPuW0kKH769I94MudNhYtYH+3+RO5Q0Xv/fMQsntWy2pAiEA1aPPCz92qVKG
m5LwZZktS316+Me3YKTGmgBxAK2dkWECIQDUb7O27eWbUrd8kzuierU4wSf4Ng3+
kjFMYbN7oeo9kQIhAMM2Rz3T462chvspLRjo+oZ8Rh2FAH8CkaauuJMSEWSBAiEA
md2CQw1BuwPNt3MOuRdmz7NgdxkJGcmjx/8bRMSOl1Y=
-----END RSA PRIVATE KEY-----`;

  @Post('')
  async getPublicKey(@Body() data: any) {
    if (!data.id || !data.publicKey) {
      return 'error in data recieve';
    }
    const user = await this.userRepository.findOne({ where: { id: data.id } });

    if (!user) {
      return 'error user';
    }
    user.publicKey = data.publicKey;
    this.userRepository.save(user);

    return { publicKeyServer: this.publicKey };
  }
  
  @Post('session')
  async session(@Body() data: any) {
    if (!data.id || !data.encSession) {
      return 'error in data recieve';
    }
    const user = await this.userRepository.findOne({ where: { id: data.id } });
    
    if (!user) {
      return 'error user';
    }
    console.log(this.encryptionService.decrpytSessionKey(data.encSession,this.privateKey));
    
    user.sessionKey = data.encSession;

    
    this.userRepository.save(user);

    return { message: 'ok' };
  }
}
