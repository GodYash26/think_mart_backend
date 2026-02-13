import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
} from "class-validator";
import { AuthProvider } from "../entities/auth.entity";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  AuthProvider: AuthProvider;
}
