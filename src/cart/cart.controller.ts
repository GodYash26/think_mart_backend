import { Controller, Get, Post, Body, Patch, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto, RemoveFromCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User, UserRole } from '../auth/entities/auth.entity';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @Roles(UserRole.CUSTOMER)
  addToCart(
    @CurrentUser() user: User,
    @Body() addToCartDto: AddToCartDto,
  ) {
    if (user.role !== UserRole.CUSTOMER) {
      throw new BadRequestException('Only customers can add items to cart');
    }
    return this.cartService.addToCart(user._id.toString(), addToCartDto);
  }

  @Get()
  @Roles(UserRole.CUSTOMER)
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user._id.toString());
  }

  @Patch('update')
  @Roles(UserRole.CUSTOMER)
  updateCartItem(
    @CurrentUser() user: User,
    @Body() updateDto: UpdateCartItemDto & { productId: string },
  ) {
    return this.cartService.updateCartItem(
      user._id.toString(),
      updateDto.productId,
      updateDto,
    );
  }

  @Delete('remove')
  @Roles(UserRole.CUSTOMER)
  removeFromCart(
    @CurrentUser() user: User,
    @Body() removeDto: RemoveFromCartDto,
  ) {
    if (user.role !== UserRole.CUSTOMER) {
      throw new BadRequestException('Only customers can remove items from cart');
    }
    return this.cartService.removeFromCart(user._id.toString(), removeDto);
  }

  @Delete('clear')
  @Roles(UserRole.CUSTOMER)
  clearCart(@CurrentUser() user: User) {
    return this.cartService.clearCart(user._id.toString());
  }
}
