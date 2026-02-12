import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  try {
    return {
      type: 'mongodb',
      url: configService.get<string>('MONGO_URI'),
      autoLoadEntities: true,
      synchronize: true,

      retryAttempts: 10,
      retryDelay: 3000,

      logging: ['error'],
    };
  } catch (error) {
    console.error(' Database configuration failed', error);
    throw error;
  }
};