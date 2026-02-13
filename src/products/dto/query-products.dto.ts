import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";
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

  @IsOptional()
  @Transform(({ value }) =>
    value === "" || value === undefined ? undefined : value === "true"
  )
  @IsBoolean()
  isFeatured?: boolean;


  @IsOptional()
  @Transform(({ value }) =>
    value === "" || value === undefined ? undefined : value === "true"
  )
  @IsBoolean()
  isOffer?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  limit?: number;
}
