import { IsMongoId, IsNumber, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsMongoId({ message: 'Product ID must be a valid MongoDB ID' })
  productId: string;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateCartDto {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
