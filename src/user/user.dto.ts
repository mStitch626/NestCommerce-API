import { IsString, IsEmail, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnedUserDetails {
  @ApiProperty({ description: 'Unique identifier of the user' })
  _id: string;

  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @ApiProperty({ description: 'First name of the user' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user' })
  last_name: string;

  @ApiProperty({ description: 'Status of the user account' })
  is_active: boolean;

  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @ApiProperty({ enum: UserRole, description: 'Role assigned to the user' })
  role: UserRole; // Assuming UserRole is an enum
}

export type returnedUserDetails = {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  email: string;
  role: UserRole;
};

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'The unique username of the user.', example: 'maitmehdi' })
  username: string;

  @IsString()
  @ApiProperty({ description: 'The first name of the user.', example: 'Mohamed' })
  first_name: string;

  @IsString()
  @ApiProperty({ description: 'The last name of the user.', example: 'Ait Mehdi' })
  last_name: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Indicates whether the user account is active or not.', example: true, default: false })
  is_active?: boolean;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: 'The email address of the user.', example: 'ait7mehdi7mohamed@gamil.com' })
  email?: string;

  @IsString()
  @ApiProperty({ description: 'The password for the user account.', example: 'mohamed' })
  password: string;

  @IsString()
  @ApiProperty({ description: 'The password confirmation for validation.', example: 'mohamed' })
  confirmed_password: string;

  @IsEnum(UserRole)
  @ApiProperty({ description: 'The role assigned to the user, specified as an enum.', example: UserRole.ADMIN })
  role: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The unique username of the user.', example: 'm.aitmehdi' })
  username: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The first name of the user.', example: 'Mohamed' })
  first_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The last name of the user.', example: 'Ait Mehdi' })
  last_name: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Indicates whether the user account is active or not.', example: true, default: false })
  is_active?: boolean;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user. This field is optional',
    example: 'ait7mehdi7mohamed@gmail.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The password for the user account.', example: 'mohamed' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    description: 'The role assigned to the user, specified as an enum.',
    example: UserRole.ADMIN,
    enum: UserRole,
    enumName: 'UserRole',
  })
  role: UserRole;
}
