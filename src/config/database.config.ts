import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  try {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST') ?? 'localhost',
      port: Number(configService.get<string>('DB_PORT') ?? 3306),
      username: configService.get<string>('DB_USER') ?? 'thinkmart',
      password: configService.get<string>('DB_PASSWORD') ?? 'thinkmart',
      database: configService.get<string>('DB_NAME') ?? 'thinkmart_db',

      autoLoadEntities: true,
      synchronize: true,

      //  VERY IMPORTANT FOR ECONNRESET
      retryAttempts: 10,
      retryDelay: 3000,

      //  MySQL connection pool
      extra: {
        connectionLimit: 10,
        keepAliveInitialDelay: 10000,
        enableKeepAlive: true,
      },

      logging: ['error'],
    };
  } catch (error) {
    console.error(' Database configuration failed', error);
    throw error;
  }
};