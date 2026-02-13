import { Column, ObjectId } from "typeorm";

export class CartItem {
  @Column()
  productId: ObjectId;

  @Column()
  quantity: number;
}