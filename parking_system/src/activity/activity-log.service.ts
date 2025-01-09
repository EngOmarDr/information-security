/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogEntity } from './activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private readonly activityLogRepository: Repository<ActivityLogEntity>,
  ) {}

  async logActivity(action: string, data: string, signature: string): Promise<void> {
    const log = this.activityLogRepository.create({ action, data, signature });
    await this.activityLogRepository.save(log);
  }

  async getAllLogs(): Promise<ActivityLogEntity[]> {
    return this.activityLogRepository.find();
  }
}
