import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
   import { ObjectId } from "mongodb";

@Entity("products")
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  // store image id
  @Column()
  image: string;

  @Column("double")
  originalPrice: number;

  @Column("double")
  discountedPrice: number;

  @Column("double")
  discountPercentage: number;

  @Column("double")
  deliveryCharge: number;

  @Column()
  category: string;

  @Column("double")
  rating: number;

  @Column()
  unit: string; // e.g "/kg"

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}