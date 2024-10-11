import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ReturnedUserDetails, returnedUserDetails } from './user.dto';
import { User, UserRole } from './user.schema';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam, ApiOperation, ApiBody } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description:
    'Unauthorized access if the user is not authenticated or if cookies are deleted, making the access token unavailable.',
})
@ApiResponse({
  status: 403,
  description:
    'Access denied. Only users with the ADMIN role are permitted to use this API for creating, updating, and deleting users.',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users',
    type: [ReturnedUserDetails],
  })
  async all(): Promise<returnedUserDetails[]> {
    const users = (await this.userService.findAll()).map((user) => {
      const { _id, username, first_name, last_name, is_active, email, role } = user;
      return { _id, username, first_name, last_name, is_active, email, role };
    });

    return users;
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Unique identifier of the user', type: String })
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User successfully retrieved using the provided ID.',
    type: ReturnedUserDetails,
  })
  async findById(@Param('id') id: string): Promise<returnedUserDetails> {
    const { _id, username, first_name, last_name, is_active, email, role } = await this.userService.findById(id);
    return { _id, username, first_name, last_name, is_active, email, role };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: ReturnedUserDetails,
  })
  @ApiResponse({
    status: 400,
    description: 'Passwords do not match!',
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() body: CreateUserDto) {
    if (body.password !== body.confirmed_password) {
      throw new BadRequestException('Passwords do not match!');
    }
    const hashed = await bcrypt.hash(body.password, 10);

    const { _id, username, first_name, last_name, is_active, email, role } = await this.userService.create(
      {
        username: body.username,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: hashed,
        role: body.role,
      },
      User.name,
    );

    return { _id, username, first_name, last_name, is_active, email, role };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the user', type: String })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully, with the updated user details returned.',
    type: ReturnedUserDetails,
  })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: number, @Body() body: UpdateUserDto): Promise<returnedUserDetails> {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const { _id, username, first_name, last_name, is_active, email, role } = await this.userService.update(id, body);

    return { _id, username, first_name, last_name, is_active, email, role };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the user', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
