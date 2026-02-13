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
	productName: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	images?: string;

	@IsNumber()
	@Min(0)
	originalPrice: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	discountedPrice?: number;

	@IsNumber()
	@Min(0)
	deliveryCharge?: number;

	@IsMongoId()
	category: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	rating?: number;

	@IsString()
	@IsNotEmpty()
	unit: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	totalStock?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	remainingStock?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	soldQuantity?: number;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	@IsBoolean()
	isFeatured?: boolean;

	@IsOptional()
	@IsBoolean()
	isDeleted?: boolean;
}
