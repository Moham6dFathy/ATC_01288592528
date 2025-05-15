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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookingDto } from './dtos/booking.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserDto } from '../auth/dtos/user.dto';
import { BookingDetailDto } from './dtos/booking_details.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Serialize(BookingDto)
  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  createBooking(@Body() bookingBody: CreateBookingDto) {
    return this.bookingService.createBooking(bookingBody);
  }

  @Serialize(BookingDetailDto)
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Serialize(BookingDetailDto)
  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/user/:userId')
  getAllUserBookings(@Param('userId') userId: string) {
    return this.bookingService.getUserBookings(userId);
  }

  @Serialize(BookingDetailDto)
  @Get('/:bookingId')
  getBooking(@Param('bookingId') bookingId: any) {
    return this.bookingService.getBooking(bookingId);
  }

  @Serialize(BookingDto)
  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('/:bookingId')
  updateBooking(
    @Param('bookingId') bookingId: string,
    @Body() UpdatedBody: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(bookingId, UpdatedBody);
  }

  @Roles('user', 'admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/:bookingId')
  deleteBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() CurrentUser: UserDto,
  ) {
    return this.bookingService.deleteBooking(bookingId, CurrentUser);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/user/:userId')
  deleteUserBookings(@Param('userId') userId: string) {
    return this.bookingService.deleteAllUserBookings(userId);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete()
  deleteAllBookings() {
    return this.bookingService.deleteAllBookings();
  }
}
