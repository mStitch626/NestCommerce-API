import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async all() {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    if (body.password !== body.confirmed_password) {
      throw new BadRequestException('Passwords do not match!');
    }
    const hashed = await bcrypt.hash(body.password, 10);

    const { id, username, first_name, last_name, email, role } = await this.userService.create({
      username: body.username,
      first_name: body.first_name,
      last_name: body.last_name,
      is_active: body.is_active,
      email: body.email,
      password: hashed,
      role: body.role,
    });

    return { id, first_name, last_name, username, email, role };
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UpdateUserDto): Promise<User> {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    return this.userService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    this.userService.remove(id);
  }
}
