import { UserRole } from "../entities/auth.entity";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
