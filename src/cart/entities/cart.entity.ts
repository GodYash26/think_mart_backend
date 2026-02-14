import { Entity, ObjectIdColumn, ObjectId, Column, UpdateDateColumn } from "typeorm";
import { CartItem } from "./cart.item.entity";

@Entity("carts")
export class Cart {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column("string")
  userId: ObjectId;

  @Column("array")
  items: CartItem[];

  @Column("number", { default: 0 })
  totalAmount: number;

  @UpdateDateColumn()
  updatedAt: Date;
}