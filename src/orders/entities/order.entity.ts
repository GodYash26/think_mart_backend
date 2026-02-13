
import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from "typeorm";
import { OrderItem } from "./order.item.entity";

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}


@Entity("orders")
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column("string")
  userId: ObjectId;

  @Column("array")
  items: OrderItem[];

  @Column("number")
  subtotalAmount: number;

  @Column("number")
  deliveryCharge: number;

  @Column("number")
  totalAmount: number;

  @Column({ type: "string", default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column("string")
  shippingAddress: string;

  @Column({ type: "string", nullable: true })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;
}