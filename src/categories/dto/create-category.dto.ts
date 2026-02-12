import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	category_name: string;
}
