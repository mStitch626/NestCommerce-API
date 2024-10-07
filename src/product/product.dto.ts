import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from 'src/category/category.dto';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => CreateCategoryDto)
  category: CreateCategoryDto;

  @IsPositive()
  price: number;

  @IsPositive()
  @IsInt()
  stock: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
