import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../auth/entities/auth.entity';
import { Request } from 'express';
import { ObjectId } from 'mongodb';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'supersecret',
      passReqToCallback: false,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(payload.sub) } as any,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}