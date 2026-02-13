import { Entity, ObjectIdColumn, ObjectId, Column, UpdateDateColumn } from "typeorm";
import { CartItem } from "./cart.item.entity";

@Entity("carts")
export class Cart {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: ObjectId;

  @Column(type => CartItem)
  items: CartItem[];

  @Column({ default: 0 })
  totalAmount: number;

  @UpdateDateColumn()
  updatedAt: Date;
}