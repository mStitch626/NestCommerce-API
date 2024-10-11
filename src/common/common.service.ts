import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

export interface paginate {
  data: any[];
  meta: { total: number; page: number; last_page: number };
}

@Injectable()
export abstract class CommonService {
  constructor(protected readonly anyRepository: Model<any>) {}

  async findAll(filter?: any): Promise<any[]> {
    return await this.anyRepository.find(filter);
  }

  async findById(id: string): Promise<any> {
    return await this.anyRepository.findById(id).exec();
  }
  async findOne(filter: any): Promise<any> {
    return await this.anyRepository.findOne(filter);
  }

  async findMany(filter: any, projection?: any): Promise<any[]> {
    return await this.anyRepository.find(filter, projection);
  }

  // async paginate(
  //   page?: number,
  //   take: number = 5,
  // ): Promise<{
  //   data: any[];
  //   meta: { total: number; take: number; page: number; last_page: number };
  // }> {
  //   const total = await this.anyRepository.countDocuments();
  //   take = page ? take : total;
  //   page = page ? page : 1;
  //   const data = await this.anyRepository
  //     .find()
  //     .skip((page - 1) * take)
  //     .limit(take)
  //     .exec();

  //   return {
  //     data: data,
  //     meta: {
  //       total,
  //       take,
  //       page,
  //       last_page: Math.ceil(total / take),
  //     },
  //   };
  // }

  async createMultiple(data, schemaName: string = 'Object'): Promise<any> {
    try {
      const result = await this.anyRepository.insertMany(data);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create ${schemaName}: ${error.message}`);
    }
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
      const result = await this.anyRepository.findByIdAndUpdate(id, data, { new: true }).exec();
      if (!result) {
        throw new NotFoundException(`${schemaName} with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Failed to update ${schemaName}: ${error.message}`);
      }
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
