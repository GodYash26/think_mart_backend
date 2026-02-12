import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	Min,
} from "class-validator";

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(120)
	name: string;

	@IsString()
	@IsNotEmpty()
	image: string;

	@IsNumber()
	@Min(0)
	originalPrice: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	discountedPrice?: number;

	@IsNumber()
	@Min(0)
	discountPercentage: number;

	@IsNumber()
	@Min(0)
	deliveryCharge: number;

	@IsMongoId()
	category: string;

	@IsNumber()
	@Min(0)
	rating: number;

	@IsString()
	@IsNotEmpty()
	unit: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}
