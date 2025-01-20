/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module'; // المستخدمون: المرحلة الأولى
import { ParkingModule } from './parking/parking.module'; // المواقف: المرحلة الثانية
import { PaymentModule } from './payment/payment.module'; // الدفع: المرحلة الثالثة
import { ActivityLogModule } from './activity/activity-log.module'; // النشاط: المرحلة الرابعة
import { CertificateModule } from './certificate/certificate.module'; // الشهادات الرقمية: المرحلة الخامسة
import { ProfileModule } from './profile/profile.module'; // أمن التطبيق (XSS/SQL Injection): المرحلة السادسة

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'parking_system_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,         // إدارة المستخدمين (الموظفين والزوار)
    ParkingModule,      // إدارة المواقف وحجزها
    PaymentModule,      // إدارة الدفع والتشفير الهجين
    ActivityLogModule,     // مراقبة النشاط والتوقيع الرقمي
    CertificateModule,  // التوثيق بالشهادات الرقمية
    ProfileModule,  
  ],
})
export class AppModule {}
