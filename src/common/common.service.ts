import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export abstract class CommonService {
  constructor(protected readonly anyRepository: Model<any>) {}

  async findAll(options?: any): Promise<any[]> {
    return await this.anyRepository.find(options);
  }

  async findById(id: string): Promise<any> {
    return await this.anyRepository.findById(id);
  }
  async findOne(where: any): Promise<any> {
    return await this.anyRepository.findOne(where);
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

  async create(data, schemaName: string = 'Object'): Promise<any> {
    try {
      const result = await this.anyRepository.create(data);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create ${schemaName}: ${error.message}`);
    }
  }

  async update(id, data, schemaName: string = 'Object'): Promise<any> {
    try {
      const result = await this.anyRepository.findByIdAndUpdate(id, data).exec();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update ${schemaName}: ${error.message}`);
    }
  }

  async remove(id: string, schemaName: string = 'Object'): Promise<void> {
    try {
      const data = await this.anyRepository.findByIdAndDelete(id).exec();
      if (!data) {
        throw new NotFoundException(`${schemaName} with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Failed to delete ${schemaName}: ${error.message}`);
      }
    }
  }
}
