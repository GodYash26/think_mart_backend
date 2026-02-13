import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity("products")
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index({ unique: true, sparse: true })
  @Column()
  productName: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  images: string;

  @Column("double")
  originalPrice: number;

  @Column("double")
  discountedPrice: number;

  @Column("double", { default: 0 })
  discountPercentage: number;

  @Column("double", { default: 0 })
  deliveryCharge: number;

  @Column()
  category: string;

  @Column("double", { default: 0 })
  rating: number;

  @Column()
  unit: string;


  @Column("int")
  totalStock: number;

  @Column("int")
  remainingStock: number;

  @Column("int", { default: 0 })
  soldQuantity: number;


  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;


  @Column({ default: false })
  isOffer: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}