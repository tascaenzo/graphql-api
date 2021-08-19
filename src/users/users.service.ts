import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput): Promise<UserDocument> {
    return this.userModel.create(createUserInput);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({ deletedAt: null });
  }

  async findOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserInput);
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { _id: id },
      { deletedAt: new Date() },
    );
  }
}
