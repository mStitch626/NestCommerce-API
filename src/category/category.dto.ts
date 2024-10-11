import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ example: 'Electronics', description: 'Updated name of the category' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Devices and gadgets', description: 'Description of the category' })
  description: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, description: 'Indicates if the category is deleted' })
  is_deleted?: boolean;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Electronics', description: 'Updated name of the category' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Devices and gadgets', description: 'Updated description of the category' })
  description: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, description: 'Indicates if the category is deleted' })
  is_deleted?: boolean;
}
