import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { AuthProvider, User, UserRole } from "./entities/auth.entity";
import { LoginDto } from "./dto/create-auth.dto";
import { RegisterDto } from "./dto/register-auth.dto";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // Check if phone number already exists
    const phoneExists = await this.userRepository.findOneBy({
      phone: registerDto.phone,
    });

    if (phoneExists) {
      throw new ConflictException("Phone number already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.userRepository.create({
      fullname: registerDto.fullname,
      email: registerDto.email,
      address: registerDto.address,
      phone: registerDto.phone,
      password: hashedPassword,
      provider: AuthProvider.LOCAL,
      role: UserRole.CUSTOMER, 
    });

    const savedUser = await this.userRepository.save(newUser);

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(savedUser);

    // Set cookies
    this.setTokenCookies(response, accessToken, refreshToken);

    console.log('User registered:', {
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return {
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        fullname: savedUser.fullname,
        role: savedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const { accessToken, refreshToken } = await this.generateTokens(user);

    this.setTokenCookies(response, accessToken, refreshToken);

    console.log('User logged in:', {
      id: user._id,
      email: user.email,
      role: user.role,
    });

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

  private getCookieBaseOptions() {
    const nodeEnv = this.configService.get<string>("NODE_ENV") ?? "production";
    const isProduction = nodeEnv !== "development";
    const sameSite: "lax" | "none" = isProduction ? "none" : "lax";
    const secure = isProduction;
    const domain = this.configService.get<string>("COOKIE_DOMAIN");

    return {
      httpOnly: true,
      secure,
      sameSite,
      path: "/",
      ...(domain ? { domain } : {}),
    };
  }

  setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string
  ) {
    const baseOptions = this.getCookieBaseOptions();

    response.cookie("access_token", accessToken, {
      ...baseOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    response.cookie("refresh_token", refreshToken, {
      ...baseOptions,
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
    const baseOptions = this.getCookieBaseOptions();

    response.clearCookie("access_token", baseOptions);
    response.clearCookie("refresh_token", baseOptions);

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

    console.log('Get profile:', {
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      address: user.address,
      phone: user.phone,
      role: user.role,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
