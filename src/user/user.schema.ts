import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: String })
  first_name: string;

  @Prop({ required: true, type: String })
  last_name: string;

  @Prop({ required: true, type: Boolean, default: true })
  is_active: boolean;

  @Prop({ required: false, type: String })
  email: number;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
