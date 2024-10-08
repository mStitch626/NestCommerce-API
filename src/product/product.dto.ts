import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsPositive()
  price: number;

  @IsPositive()
  @IsInt()
  stock: number;
}

export class UpdateProductDto {}
