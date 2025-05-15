import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userInfo: CreateUserDto): Promise<any> {
    const user = await this.userModel.create(userInfo);
    return user;
  }

  async findOneById(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async updateUser(userId: string, updatedBody: CreateUserDto) {
    const user = await this.userModel.findByIdAndDelete(userId, updatedBody);

    return user;
  }

  async deleteUser(userId: string) {
    await this.userModel.findByIdAndDelete(userId);
  }

  async deleteAllUsers() {
    await this.userModel.deleteMany({ role: 'user' });
  }
}
