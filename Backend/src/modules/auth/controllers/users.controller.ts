import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Roles('admin')
@UseGuards(AuthGuard, RolesGuard)
@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.userService.create(body);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.findOneById(userId);
  }

  @Patch('/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updatedBody: CreateUserDto,
  ) {
    return this.userService.updateUser(userId, updatedBody);
  }

  @Delete('/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Delete()
  deleteAllUsers() {
    return this.userService.deleteAllUsers();
  }
}
