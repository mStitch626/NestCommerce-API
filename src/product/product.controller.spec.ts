/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { CreateProductDto, ProductFilterDto, UpdateProductDto } from './product.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;
  let categoryService: CategoryService;

  const mockProductService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    createMultiple: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategoryService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('findById', () => {
    it('should return a product by ID', async () => {
      const result = {
        _id: new Types.ObjectId().toString(),
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        category: new Types.ObjectId().toString(),
      };
      mockProductService.findById.mockResolvedValue(result);

      expect(await productController.findById(result._id)).toBe(result);
      expect(mockProductService.findById).toHaveBeenCalledWith(result._id);
    });
  });

  describe('find', () => {
    it('should return an array of products based on filters', async () => {
      const filterDto: ProductFilterDto = { category_name: 'Test Category', minPrice: 50, maxPrice: 150 };
      const categoryMock = { _id: new Types.ObjectId().toString(), name: 'Test Category' };
      const result = [
        {
          _id: new Types.ObjectId().toString(),
          name: 'Test Product',
          description: 'A test product',
          price: 100,
          category: categoryMock._id,
        },
      ];

      mockCategoryService.findOne.mockResolvedValue(categoryMock);
      mockProductService.findAll.mockResolvedValue(result);

      expect(await productController.find(filterDto, false)).toEqual(result);
      expect(mockProductService.findAll).toHaveBeenCalledWith(
        { category: categoryMock._id, price: { $gte: 50, $lte: 150 }, is_deleted: false },
        undefined,
        undefined,
      );
    });

    it('should return an empty response if the category is not found', async () => {
      const filterDto: ProductFilterDto = { category_name: 'Unknown Category' };
      mockCategoryService.findOne.mockResolvedValue(null);

      expect(await productController.find(filterDto, false)).toEqual({ data: [], meta: { total: 0 } });
      expect(mockCategoryService.findOne).toHaveBeenCalledWith({ name: 'Unknown Category' });
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const categoryMock = { _id: new Types.ObjectId().toString(), name: 'Test Category' };
      const productData: CreateProductDto = {
        name: 'New Product',
        description: 'description new product',
        stock: 500,
        price: 100,
        category: categoryMock._id,
      };
      const result = { ...productData, _id: new Types.ObjectId().toString() };

      mockCategoryService.findOne.mockResolvedValue(categoryMock);
      mockProductService.create.mockResolvedValue(result);

      expect(await productController.create(productData)).toBe(result);
      expect(mockProductService.create).toHaveBeenCalledWith(productData, 'Product');
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      const productData: CreateProductDto = {
        name: 'New Product',
        description: 'description new product',
        stock: 500,
        price: 100,
        category: 'invalid_category_id',
      };
      mockCategoryService.findOne.mockResolvedValue(null);

      await expect(productController.create(productData)).rejects.toThrow(
        new NotFoundException('Failed to create Product: Category with ID invalid_category_id not found'),
      );
    });
  });

  describe('createMultiple', () => {
    it('should create multiple products', async () => {
      const categoryMock = { _id: new Types.ObjectId().toString(), name: 'Test Category' };
      const productsData: CreateProductDto[] = [
        { name: 'Product 1', description: 'description product 1', stock: 500, price: 100, category: categoryMock._id },
        { name: 'Product 2', description: 'description product 2', stock: 600, price: 150, category: categoryMock._id },
      ];
      const result = productsData.map((product) => ({ ...product, _id: new Types.ObjectId().toString() }));

      mockCategoryService.findOne.mockResolvedValue(categoryMock);
      mockProductService.createMultiple.mockResolvedValue(result);

      expect(await productController.createMultiple(productsData)).toBe(result);
      expect(mockProductService.createMultiple).toHaveBeenCalledWith(productsData, 'Product');
    });

    it('should throw NotFoundException if any category is not found', async () => {
      const productsData: CreateProductDto[] = [
        {
          name: 'Product 1',
          price: 100,
          category: 'invalid_category_id',
          description: '',
          stock: 0,
        },
      ];
      mockCategoryService.findOne.mockResolvedValue(null);

      await expect(productController.createMultiple(productsData)).rejects.toThrow(
        new NotFoundException(
          'Failed to create Product: Category with ID invalid_category_id not found for product Product 1',
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const categoryMock = { _id: new Types.ObjectId().toString(), name: 'Test Category' };
      const updateData: UpdateProductDto = { name: 'Updated Product', category: categoryMock._id };
      const result = { ...updateData, _id: new Types.ObjectId().toString() };

      mockCategoryService.findOne.mockResolvedValue(categoryMock);
      mockProductService.update.mockResolvedValue(result);

      expect(await productController.update(result._id, updateData)).toBe(result);
      expect(mockProductService.update).toHaveBeenCalledWith(result._id, updateData);
    });

    it('should throw a NotFoundException if the category is not found during update', async () => {
      const updateData: UpdateProductDto = { name: 'Updated Product', category: 'invalid_category_id' };
      mockCategoryService.findOne.mockResolvedValue(null);

      await expect(productController.update('product_id', updateData)).rejects.toThrow(
        new NotFoundException('Failed to update Product: Category with ID invalid_category_id not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a product by ID', async () => {
      mockProductService.remove.mockResolvedValue(undefined);

      expect(await productController.remove('product_id')).toBeUndefined();
      expect(mockProductService.remove).toHaveBeenCalledWith('product_id', 'Product');
    });
  });
});
