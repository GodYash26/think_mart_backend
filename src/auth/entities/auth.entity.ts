import {
  Column,
  ObjectId,
  ObjectIdColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

@Entity("users")
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: AuthProvider.LOCAL })
  provider: AuthProvider;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ default: UserRole.CUSTOMER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}