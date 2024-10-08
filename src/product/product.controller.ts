import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from 'src/product/product.dto';
import { ProductService } from 'src/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  async get() {
    return await this.productService.findAll();
  }

  @Post()
  async create(@Body() productData: CreateProductDto) {
    return await this.productService.create(productData);
  }
}
