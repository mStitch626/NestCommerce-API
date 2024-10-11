import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'maitmehdi', description: 'The username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'mohamed', description: 'The password of the user' })
  @IsString()
  password: string;
}
