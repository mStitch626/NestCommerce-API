import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
})
export class Product extends Document {
  @ApiProperty({
    description: 'The name of the product.',
    example: 'Smartphone',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product.',
    example: 'Latest model smartphone with advanced features.',
    required: true,
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'The category ID to which the product belongs.',
    type: String,
    example: '607f1f77bcf86cd799439011',
    required: true,
  })
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;

  @ApiProperty({
    description: 'The price of the product.',
    example: 299.99,
    required: true,
  })
  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @ApiProperty({
    description: 'The available stock quantity of the product.',
    example: 50,
    required: true,
  })
  @Prop({ required: true, type: Number, min: 0 })
  stock: number;

  @ApiProperty({
    description: 'Indicates if the product is deleted (soft delete).',
    example: false,
    default: false,
  })
  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
