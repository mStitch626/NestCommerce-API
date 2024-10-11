import { Injectable } from '@nestjs/common';
import { CommonService } from '../common/common.service';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService extends CommonService {
  constructor(
    @InjectModel(Product.name)
    private readonly productRepository: Model<Product>,
  ) {
    super(productRepository);
  }

  async findAll(query?: any, page?: number, take?: number): Promise<any> {
    return await this.paginate(query, page, take);
  }

  async paginate(
    query?: any,
    page?: number,
    take: number = 5,
  ): Promise<{
    data: any[];
    meta: { total: number; take?: number; page?: number; last_page?: number };
  }> {
    const total = await this.productRepository.countDocuments();
    take = page ? take : total;
    page = page ? page : 1;
    const data = await this.productRepository
      .find(query)
      .skip((page - 1) * take)
      .limit(take)
      .populate('category')
      .exec();
    if (data.length == 0) {
      return {
        data: [],
        meta: {
          total: 0,
        },
      };
    }
    return {
      data: data,
      meta: {
        total,
        take,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }
  // async softDeleteAll(): Promise<any> {
  //   return await this.productRepository.updateMany({}, { $set: { is_deleted: false } });
  // }
}
