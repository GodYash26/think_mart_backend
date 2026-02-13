import { ObjectId } from "typeorm";

export class OrderItem {
  productId: ObjectId;
  productName: string;
  unit: string;
  originalPrice: number;
  discountedPrice: number;
  priceAfterDiscount: number;
  discountPercentage: number;
  quantity: number;
  subtotal: number;
}