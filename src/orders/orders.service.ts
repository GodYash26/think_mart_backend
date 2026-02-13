import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../auth/entities/auth.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const orderItems: OrderItem[] = [];
    let subtotalAmount = 0;
    let totalDeliveryCharge = 0;

    // Validate products and calculate total
    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { _id: new ObjectId(item.productId) } as any,
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.productName} is not available`);
      }

      // Handle null or undefined remainingStock
      const availableStock = product.remainingStock ?? product.totalStock ?? 0;
      
      if (availableStock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.productName}. Available: ${availableStock}, Requested: ${item.quantity}`
        );
      }

      // Calculate priceAfterDiscount if not already set
      const priceAfterDiscount = product.priceAfterDiscount || (product.originalPrice - product.discountedPrice);
      const subtotal = priceAfterDiscount * item.quantity;
      subtotalAmount += subtotal;
      totalDeliveryCharge += product.deliveryCharge || 0;

      orderItems.push({
        productId: product._id,
        productName: product.productName,
        unit: product.unit,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        priceAfterDiscount: priceAfterDiscount,
        discountPercentage: product.discountPercentage,
        quantity: item.quantity,
        subtotal,
      });

      // Update product stock
      product.remainingStock = availableStock - item.quantity;
      product.soldQuantity = (product.soldQuantity ?? 0) + item.quantity;
      await this.productRepository.save(product);
    }

    const totalAmount = subtotalAmount + totalDeliveryCharge;

    // Create order
    const order = this.orderRepository.create({
      userId: new ObjectId(userId),
      items: orderItems,
      subtotalAmount,
      deliveryCharge: totalDeliveryCharge,
      totalAmount,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod || 'Cash on Delivery',
    });

    const savedOrder = await this.orderRepository.save(order);

    return {
      message: 'Order placed successfully',
      order: savedOrder,
    };
  }

  async findAll() {
    const orders = await this.orderRepository.find({
      order: { createdAt: -1 },
    });

    // Fetch user details for each order
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        const user = await this.userRepository.findOne({
          where: { _id: order.userId } as any,
        });
        return {
          ...order,
          user: user ? {
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
          } : null,
        };
      }),
    );

    return {
      message: 'Orders retrieved successfully',
      orders: ordersWithUsers,
    };
  }

  async findAllByUser(userId: string) {
    const orders = await this.orderRepository.find({
      where: { userId: new ObjectId(userId) } as any,
      order: { createdAt: -1 },
    });

    // Fetch user details
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) } as any,
    });

    const ordersWithUser = orders.map((order) => ({
      ...order,
      user: user ? {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
      } : null,
    }));

    return {
      message: 'User orders retrieved successfully',
      orders: ordersWithUser,
    };
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { _id: new ObjectId(id) } as any,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    const updatedOrder = await this.orderRepository.save(order);

    return {
      message: 'Order updated successfully',
      order: updatedOrder,
    };
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.delete({ _id: order._id } as any);

    return {
      message: 'Order deleted successfully',
    };
  }
}
