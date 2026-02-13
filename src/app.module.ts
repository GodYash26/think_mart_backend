import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core/constants';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { FavoriteModule } from './favorite/favorite.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, `src/.env`],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 1000,
    }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    MediaModule,
    ProductsModule,
    CategoriesModule,
    AuthModule,
    UserModule,
    OrdersModule,
    FavoriteModule,
    CartModule,
    
  ],


  controllers: [AppController],
  providers: [AppService,
     {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
