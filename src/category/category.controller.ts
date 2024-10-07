import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCategoryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  async get() {
    return await this.categoryService.findAll();
  }

  @Post()
  async create(@Body() categoryData: CreateCategoryDto) {
    return await this.categoryService.create(categoryData);
  }
}
