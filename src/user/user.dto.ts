import { IsNotEmpty, IsString, IsEmail, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from './user.schema';
import { Exclude, Expose } from 'class-transformer';

export class GetUserDto {
  @Expose()
  username: string;
  @Expose()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @Exclude()
  is_active: boolean;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  role: UserRole;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmed_password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto extends CreateUserDto {}
