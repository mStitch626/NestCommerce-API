import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
})
export class Category extends Document {
  @ApiProperty({ example: '67080a3144392bc2a0c4a506', description: 'Unique identifier for the category' })
  _id: string;

  @Prop({ required: true, type: String })
  @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
  name: string;

  @Prop({ required: true, type: String })
  @ApiProperty({ example: 'Devices and gadgets', description: 'Description of the category' })
  description: string;

  @Prop({ type: Boolean, default: false })
  @ApiProperty({ example: false, description: 'Indicates if the category is deleted' })
  is_deleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
