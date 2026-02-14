import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto, RemoveFromCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: MongoRepository<Cart>,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId: new ObjectId(userId) },
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId: new ObjectId(userId),
        items: [],
        totalAmount: 0,
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    // Verify product exists
    const product = await this.productsService.findOne(addToCartDto.productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.remainingStock < addToCartDto.quantity) {
      throw new BadRequestException(`Only ${product.remainingStock} items available in stock`);
    }

    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === addToCartDto.productId,
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += addToCartDto.quantity;
    } else {
      // Add new item
      const cartItem = new CartItem();
      cartItem.productId = new ObjectId(addToCartDto.productId);
      cartItem.quantity = addToCartDto.quantity;
      cart.items.push(cartItem);
    }

    // Recalculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const prod = await this.productsService.findOne(item.productId.toString());
      const priceAfterDiscount = prod.priceAfterDiscount || (prod.originalPrice - prod.discountedPrice);
      totalAmount += priceAfterDiscount * item.quantity;
    }

    cart.totalAmount = totalAmount;
    await this.cartRepository.save(cart);

    // Populate product details
    const cartWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productsService.findOne(item.productId.toString());
        const priceAfterDiscount = product.priceAfterDiscount || (product.originalPrice - product.discountedPrice);
        
        return {
          _id: item.productId,
          productName: product.productName,
          image: product.imageUrl || product.images,
          quantity: item.quantity,
          price: priceAfterDiscount,
          deliveryCharge: product.deliveryCharge,
          originalPrice: product.originalPrice,
          discountedPrice: product.discountedPrice,
          totalPrice: priceAfterDiscount * item.quantity,
        };
      }),
    );

    return {
      message: 'Item added to cart successfully',
      cart: {
        _id: cart._id,
        items: cartWithDetails,
        totalAmount: cart.totalAmount,
        updatedAt: cart.updatedAt,
      },
    };
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    // Populate product details
    const cartWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productsService.findOne(item.productId.toString());
        const priceAfterDiscount = product.priceAfterDiscount || (product.originalPrice - product.discountedPrice);
        
        return {
          _id: item.productId,
          productName: product.productName,
          image: product.imageUrl || product.images,
          quantity: item.quantity,
          price: priceAfterDiscount,
          deliveryCharge: product.deliveryCharge,
          originalPrice: product.originalPrice,
          discountedPrice: product.discountedPrice,
          totalPrice: priceAfterDiscount * item.quantity,
        };
      }),
    );

    return {
      message: 'Cart retrieved successfully',
      cart: {
        _id: cart._id,
        items: cartWithDetails,
        totalAmount: cart.totalAmount,
        updatedAt: cart.updatedAt,
      },
    };
  }

  async updateCartItem(userId: string, productId: string, updateDto: UpdateCartItemDto) {
    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.remainingStock < updateDto.quantity) {
      throw new BadRequestException(`Only ${product.remainingStock} items available in stock`);
    }

    const cart = await this.getOrCreateCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items[itemIndex].quantity = updateDto.quantity;

    // Recalculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const prod = await this.productsService.findOne(item.productId.toString());
      const priceAfterDiscount = prod.priceAfterDiscount || (prod.originalPrice - prod.discountedPrice);
      totalAmount += priceAfterDiscount * item.quantity;
    }

    cart.totalAmount = totalAmount;
    await this.cartRepository.save(cart);

    // Populate product details
    const cartWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productsService.findOne(item.productId.toString());
        const priceAfterDiscount = product.priceAfterDiscount || (product.originalPrice - product.discountedPrice);
        
        return {
          _id: item.productId,
          productName: product.productName,
          image: product.imageUrl || product.images,
          quantity: item.quantity,
          price: priceAfterDiscount,
          deliveryCharge: product.deliveryCharge,
          originalPrice: product.originalPrice,
          discountedPrice: product.discountedPrice,
          totalPrice: priceAfterDiscount * item.quantity,
        };
      }),
    );

    return {
      message: 'Cart item updated successfully',
      cart: {
        _id: cart._id,
        items: cartWithDetails,
        totalAmount: cart.totalAmount,
        updatedAt: cart.updatedAt,
      },
    };
  }

  async removeFromCart(userId: string, removeDto: RemoveFromCartDto) {
    const cart = await this.getOrCreateCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === removeDto.productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await this.productsService.findOne(item.productId.toString());
      const priceAfterDiscount = product.priceAfterDiscount || (product.originalPrice - product.discountedPrice);
      totalAmount += priceAfterDiscount * item.quantity;
    }

    cart.totalAmount = totalAmount;
    await this.cartRepository.save(cart);

    // Populate product details
    const cartWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productsService.findOne(item.productId.toString());
        const priceAfterDiscount = product.priceAfterDiscount || (product.originalPrice - product.discountedPrice);
        
        return {
          _id: item.productId,
          productName: product.productName,
          image: product.imageUrl || product.images,
          quantity: item.quantity,
          price: priceAfterDiscount,
          deliveryCharge: product.deliveryCharge,
          originalPrice: product.originalPrice,
          discountedPrice: product.discountedPrice,
          totalPrice: priceAfterDiscount * item.quantity,
        };
      }),
    );

    return {
      message: 'Item removed from cart successfully',
      cart: {
        _id: cart._id,
        items: cartWithDetails,
        totalAmount: cart.totalAmount,
        updatedAt: cart.updatedAt,
      },
    };
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    cart.totalAmount = 0;
    await this.cartRepository.save(cart);

    return {
      message: 'Cart cleared successfully',
      cart: {
        _id: cart._id,
        items: [],
        totalAmount: 0,
        updatedAt: cart.updatedAt,
      },
    };
  }
}
