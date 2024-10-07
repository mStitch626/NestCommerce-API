import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export abstract class CommonService {
  constructor(protected readonly anyRepository: Model<any>) {}

  async findAll(options?: any): Promise<any[]> {
    return await this.anyRepository.find(options);
  }

  async findOne(where, select: any[] = []): Promise<any> {
    return await this.anyRepository.findOne({ where, select });
  }

  async findMany(conditions: any): Promise<any[]> {
    return await this.anyRepository.find(conditions);
  }

  async paginate(page: number = 1): Promise<{
    data: any[];
    meta: { total: number; page: number; last_page: number };
  }> {
    const take = 15;

    const [data, total] = await this.anyRepository.find({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: data,

      meta: {
        total,
        page,
        last_page: Math.ceil(total / page),
      },
    };
  }

  async create(data): Promise<any> {
    return await this.anyRepository.create(data);
  }

  async update(id, data): Promise<any> {
    await this.anyRepository.updateOne(id, data);

    return this.anyRepository.findById({ id });
  }

  async remove(id: number): Promise<void> {
    await this.anyRepository.deleteOne();
  }
}
