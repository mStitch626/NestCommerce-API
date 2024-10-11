/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  const mockCategoryService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    createMultiple: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
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

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of categories', async () => {
      const result = [
        {
          _id: new Types.ObjectId().toString(),
          name: 'Test Category',
          description: 'A test category',
          is_deleted: false,
        },
      ];
      mockCategoryService.findAll.mockResolvedValue(result);

      expect(await categoryController.find()).toBe(result);
      expect(mockCategoryService.findAll).toHaveBeenCalledWith({});
    });

    it('should filter categories by deletion status', async () => {
      const result = [
        {
          _id: new Types.ObjectId().toString(),
          name: 'Test Category',
          description: 'A Test category',
          is_deleted: false,
        },
        {
          _id: new Types.ObjectId().toString(),
          name: 'Deleted Category',
          description: 'A deleted category',
          is_deleted: true,
        },
      ];
      mockCategoryService.findAll.mockResolvedValue(result);

      expect(await categoryController.find(true)).toBe(result);
      expect(mockCategoryService.findAll).toHaveBeenCalledWith({ is_deleted: true });
    });
  });

  describe('findById', () => {
    it('should return a category by ID', async () => {
      const _id1 = new Types.ObjectId().toString();
      const _id2 = new Types.ObjectId().toString();

      const result = {
        _id: _id2,
        name: 'Deleted Category',
        description: 'A deleted category',
        is_deleted: true,
      };
      mockCategoryService.findById.mockResolvedValue(result);

      expect(await categoryController.findById(_id2.toString())).toBe(result);
      expect(mockCategoryService.findById).toHaveBeenCalledWith(_id2.toString());
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const categoryData: CreateCategoryDto = { name: 'New Category', description: 'A new category' };
      const result = {
        ...categoryData,
        _id: new Types.ObjectId().toString(),
        is_deleted: false,
      };

      mockCategoryService.create.mockResolvedValue(result);

      expect(await categoryController.create(categoryData)).toBe(result);
      expect(mockCategoryService.create).toHaveBeenCalledWith(categoryData);
    });
  });

  describe('createMany', () => {
    it('should create multiple categories', async () => {
      const categoryData: CreateCategoryDto[] = [
        { name: 'Category 1', description: 'First category' },
        { name: 'Category 2', description: 'Second category' },
      ];
      const result = categoryData.map((data) => ({
        ...data,
        _id: new Types.ObjectId().toString(),
        is_deleted: false,
      }));
      mockCategoryService.createMultiple.mockResolvedValue(result);

      expect(await categoryController.createMany(categoryData)).toBe(result);
      expect(mockCategoryService.createMultiple).toHaveBeenCalledWith(categoryData);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateData: UpdateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated description',
        is_deleted: false,
      };
      const _id = new Types.ObjectId().toString();
      const result = {
        _id,
        name: 'Updated Category',
        description: 'Updated description',
        is_deleted: false,
      };

      mockCategoryService.update.mockResolvedValue(result);

      expect(await categoryController.update(_id.toString(), updateData)).toBe(result);
      expect(mockCategoryService.update).toHaveBeenCalledWith(_id.toString(), updateData, 'Category');
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockCategoryService.remove.mockResolvedValue(undefined);

      expect(await categoryController.remove('1')).toBeUndefined();
      expect(mockCategoryService.remove).toHaveBeenCalledWith('1', 'Category');
    });
  });
});
