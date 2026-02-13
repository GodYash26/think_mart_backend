import { Column, ObjectId } from "typeorm";

export class OrderItem {
  @Column()
  productId: ObjectId;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  subtotal: number;
}