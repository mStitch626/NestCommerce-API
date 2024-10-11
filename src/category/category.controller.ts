import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRole } from '../user/user.schema';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Category')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description:
    'Unauthorized access if the user is not authenticated or if cookies are deleted, making the access token unavailable.',
})
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all categories.',
    type: [Category],
  })
  @ApiQuery({
    name: 'is_deleted',
    required: false,
    type: Boolean,
    description:
      'Optional flag to filter categories based on their deletion status. Use true to retrieve deleted categories and false for non-deleted categories.',
  })
  async find(@Query('is_deleted') is_deleted?: boolean): Promise<Category[]> {
    const query: any = {};
    if (typeof is_deleted !== 'undefined') query.is_deleted = is_deleted;

    return await this.categoryService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Unique identifier of the category', type: String })
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category successfully retrieved using the provided ID.',
    type: Category,
  })
  async findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the category.',
    type: Category,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN and MANAGER roles can create categories.',
  })
  @ApiBody({ type: CreateCategoryDto })
  async create(@Body() categoryData: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(categoryData);
  }

  @Post('multiple')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create multiple categories' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created multiple categories.',
    type: [Category],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN and MANAGER roles can create categories.',
  })
  @ApiBody({ type: [CreateCategoryDto] })
  async createMany(@Body() categoryData: CreateCategoryDto[]): Promise<Category[]> {
    return await this.categoryService.createMultiple(categoryData);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiParam({ name: 'id', description: 'Unique identifier of the category', type: String })
  @ApiOperation({ summary: 'Update an existing category' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the category.',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN and MANAGER roles can update categories.',
  })
  @ApiBody({ type: UpdateCategoryDto, required: false })
  async update(@Param('id') id: string, @Body() categoryData: UpdateCategoryDto) {
    return await this.categoryService.update(id, categoryData, Category.name);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'Unique identifier of the category', type: String })
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the category.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN role can delete categories.',
  })
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id, Category.name);
  }
}
