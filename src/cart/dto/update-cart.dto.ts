import { IsMongoId, IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class RemoveFromCartDto {
  @IsMongoId({ message: 'Product ID must be a valid MongoDB ID' })
  productId: string;
}
