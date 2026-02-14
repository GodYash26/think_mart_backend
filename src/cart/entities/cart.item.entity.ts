import { ObjectId } from "typeorm";

export class CartItem {
  productId: ObjectId;
  quantity: number;
}