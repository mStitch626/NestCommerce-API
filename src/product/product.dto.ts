import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone', description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Latest model with advanced features', description: 'Description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ example: '603d2b2b1234567890abcdef', description: 'ID of the category the product belongs to' })
  @IsString()
  category: string;

  @ApiProperty({ example: 699.99, description: 'Price of the product' })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 100, description: 'Stock quantity of the product' })
  @IsPositive()
  @IsInt()
  stock: number;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Smartphone', description: 'Name of the product', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Latest model with advanced features',
    description: 'Description of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '603d2b2b1234567890abcdef',
    description: 'ID of the category the product belongs to',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 699.99, description: 'Price of the product', required: false })
  @IsOptional()
  @IsPositive()
  price?: number;

  @ApiProperty({ example: 100, description: 'Stock quantity of the product', required: false })
  @IsOptional()
  @IsPositive()
  @IsInt()
  stock?: number;

  @ApiProperty({ example: false, description: 'Indicates whether the product is deleted', required: false })
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
export class ProductFilterDto {
  @ApiProperty({
    description: 'Optional ID of the category to filter products by.',
    example: '60c72b2f9b1d4c001c8e4a0d', // Example category ID
  })
  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional name of the category to filter products by.',
    example: 'Electronics',
  })
  category_name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Optional minimum price to filter products. Must be a non-negative number.',
    example: 100,
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Optional maximum price to filter products. Must be a non-negative number.',
    example: 500,
  })
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description:
      'The optional page number for pagination, which should be a positive integer starting at 1. If not specified, all products will be returned.',
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description:
      'The optional quantity of items to return per page, which must be a positive integer. The default value is set to 5.',
    example: 5,
  })
  take?: number;
}

class MetaDto {
  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 10, description: 'Number of items returned per page' })
  take?: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page?: number;

  @ApiProperty({ example: 10, description: 'Last page number' })
  last_page?: number;
}

export class PaginatedResponseDto<CreateProductDto> {
  @ApiProperty({ type: [CreateProductDto], description: 'Array of products returned' })
  data: CreateProductDto[];

  @ApiProperty({ type: MetaDto, description: 'Metadata about the pagination' })
  meta: MetaDto;
}
