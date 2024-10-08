import { Injectable } from '@nestjs/common';
import { Category } from './category.schema';
import { CommonService } from 'src/common/common.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService extends CommonService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryRepository: Model<Category>,
  ) {
    super(categoryRepository);
  }
}
