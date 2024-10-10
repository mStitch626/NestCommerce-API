import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  async get() {
    return await this.categoryService.findAll();
  }

  @Post()
  async create(@Body() categoryData: CreateCategoryDto[]) {
    return await this.categoryService.create(categoryData);
  }

  @Post('multiple')
  async createMany(@Body() categoryData: CreateCategoryDto[]) {
    return await this.categoryService.createMultiple(categoryData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() categoryData: UpdateCategoryDto) {
    return await this.categoryService.update(id, categoryData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id, Category.name);
  }
}
