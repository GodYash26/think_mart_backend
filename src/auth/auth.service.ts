import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { User } from "./entities/auth.entity";
import { LoginDto } from "./dto/create-auth.dto";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const { accessToken, refreshToken } = await this.generateTokens(user);

    this.setTokenCookies(response, accessToken, refreshToken);

    return {
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  async generateTokens(user: User) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string
  ) {
    const isProduction = this.configService.get<string>("NODE_ENV") === "production";
    
    response.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
  }

  async refreshTokens(refreshToken: string, response: Response) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(payload.sub) } as any,
      });

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens(user);
      this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);

      return {
        message: "Tokens refreshed successfully",
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  logout(response: Response) {
    response.clearCookie("access_token");
    response.clearCookie("refresh_token");

    return {
      message: "Logout successful",
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) } as any,
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    return {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
