/* eslint-disable prettier/prettier */
/* src/profile/profile.service.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import * as DOMPurify from 'isomorphic-dompurify'; // لتنقية المدخلات

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async createProfile(name: string, bio: string): Promise<Profile> {
    // تنقية المدخلات لمنع هجمات XSS
    const sanitizedBio = DOMPurify.sanitize(bio);

    const profile = this.profileRepository.create({
      name,
      bio: sanitizedBio,
    });

    return this.profileRepository.save(profile);
  }

  async getProfile(id: number): Promise<Profile> {
    return this.profileRepository.findOne({ where: { id } });
  }
}
