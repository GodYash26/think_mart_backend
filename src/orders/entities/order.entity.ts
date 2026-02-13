
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

  @Column()
  userId: ObjectId;

  @Column(type => OrderItem)
  items: OrderItem[];

  @Column()
  totalAmount: number;

  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column()
  shippingAddress: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;
}