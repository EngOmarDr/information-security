/* eslint-disable prettier/prettier */
/* src/profile/profile.controller.ts */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  async createProfile(
    @Body('name') name: string,
    @Body('bio') bio: string,
  ): Promise<Profile> {
    return this.profileService.createProfile(name, bio);
  }

  @Get(':id')
  async getProfile(@Param('id') id: number): Promise<Profile> {
    return this.profileService.getProfile(id);
  }
}
