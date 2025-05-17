import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { BookingService } from 'src/modules/booking/booking.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(forwardRef(() => BookingService))
    private bookingService: BookingService,
  ) {}

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

  async updateUser(userId: string, updatedBody: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, updatedBody);

    return user;
  }

  async deleteUser(userId: string) {
    const user = this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    await this.bookingService.deleteAllUserBookings(userId);

    await this.userModel.findByIdAndDelete(userId);
  }

  async deleteAllUsers() {
    await this.userModel.deleteMany({ role: 'user' });
  }
}
