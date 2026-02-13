import { IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

export class QueryProductsDto {
  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : Number(value)))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : Number(value)))
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
