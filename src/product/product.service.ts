import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService extends CommonService {
  constructor(
    @InjectModel(Product.name)
    productRepository: Model<Product>,
  ) {
    super(productRepository);
  }
}
