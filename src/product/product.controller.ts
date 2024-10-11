import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateProductDto, PaginatedResponseDto, ProductFilterDto, UpdateProductDto } from '../product/product.dto';
import { ProductService } from '../product/product.service';
import { Product } from './product.schema';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.schema';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { UserRole } from '../user/user.schema';
import { Roles } from '../roles/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
@ApiTags('Product')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description:
    'Unauthorized access if the user is not authenticated or if cookies are deleted, making the access token unavailable.',
})
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the product', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product successfully retrieved using the provided ID.',
    type: Product,
  })
  async findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Post('get_products')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve products based on filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved products matching the filters.',
    type: [Product],
  })
  @ApiResponse({
    status: 404,
    description: 'No products found matching the specified filters.',
  })
  @ApiBody({
    type: ProductFilterDto,
    required: false,
    description:
      'Retrieve products using optional filters and pagination; if these options are omitted, all products will be included in the response',
  })
  @ApiQuery({
    name: 'is_deleted',
    required: false,
    type: Boolean,
    description:
      'Optional flag to filter products based on their deletion status. Use true to retrieve deleted products and false for non-deleted products.',
  })
  async find(@Body() filters: ProductFilterDto, @Query('is_deleted') is_deleted?: boolean) {
    const query: any = {};
    if (filters.category_id) {
      query.category = filters.category_id;
    } else if (filters.category_name) {
      const category = await this.categoryService.findOne({ name: filters.category_name });
      if (category) {
        query.category = category._id.toString();
      } else {
        return { data: [], meta: { total: 0 } };
      }
    }
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
    } else if (filters.minPrice !== undefined) {
      query.price = { $gte: filters.minPrice };
    } else if (filters.maxPrice !== undefined) {
      query.price = { $lte: filters.maxPrice };
    }
    if (typeof is_deleted !== 'undefined') query.is_deleted = is_deleted;

    return await this.productService.findAll(query, filters.page, filters.take);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the product.',
    type: PaginatedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN and MANAGER roles can create products.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found. Unable to create the product with the specified category ID.',
  })
  @ApiBody({ type: CreateProductDto })
  async create(@Body() productData: CreateProductDto) {
    const category = await this.categoryService.findOne({ _id: productData.category });
    if (!category) {
      throw new NotFoundException(
        `Failed to create ${Product.name}: ${Category.name} with ID ${productData.category} not found`,
      );
    }
    return await this.productService.create(productData, Product.name);
  }

  @Post('multiple')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create multiple products' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created multiple products.',
    type: [Product],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN and MANAGER roles can create multiple products.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found for one or more products.',
  })
  async createMultiple(@Body() productsData: CreateProductDto[]) {
    for (const productData of productsData) {
      const category = await this.categoryService.findOne({ _id: productData.category });
      if (!category) {
        throw new NotFoundException(
          `Failed to create ${Product.name}: ${Category.name} with ID ${productData.category} not found for product ${productData.name}`,
        );
      }
    }
    const createdProducts = await this.productService.createMultiple(productsData, Product.name);
    return createdProducts;
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiParam({ name: 'id', description: 'Unique identifier of the product', type: String })
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the product.',
    type: Product,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN and MANAGER roles can update products.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product or category not found. Unable to update the product with the specified ID.',
  })
  @ApiBody({ type: UpdateProductDto, required: false })
  async update(@Param('id') id: string, @Body() productData: UpdateProductDto) {
    if (productData.category) {
      const category = await this.categoryService.findOne({ _id: productData.category });
      if (!category)
        throw new NotFoundException(
          `Failed to update ${Product.name}: ${Category.name} with ID ${productData.category} not found`,
        );
    }
    return await this.productService.update(id, productData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'Unique identifier of the product', type: String })
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the product.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Only ADMIN role can delete products.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id, Product.name);
  }
}
