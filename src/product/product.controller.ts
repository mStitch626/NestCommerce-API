import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { CreateProductDto } from 'src/product/product.dto';
import { ProductService } from 'src/product/product.service';
import { Product } from './product.schema';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/category.schema';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}
  @Get()
  async get() {
    return await this.productService.findAll();
  }

  @Post()
  async create(@Body() productData: CreateProductDto) {
    const category = await this.categoryService.findOne({ _id: productData.category });
    if (!category) {
      throw new NotFoundException(
        `Failed to create ${Product.name}: ${Category.name} with ID ${productData.category} not found`,
      );
    }
    return await this.productService.create(productData, Product.name);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id, Product.name);
  }
}
