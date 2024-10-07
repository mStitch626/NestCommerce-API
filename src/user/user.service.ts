import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService extends CommonService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
  ) {
    super(userRepository);
  }
}
