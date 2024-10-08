import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
