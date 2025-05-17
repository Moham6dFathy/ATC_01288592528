import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Booking } from './schemas/booking.schema';
import mongoose, { Connection, Document, Model } from 'mongoose';
import { UsersService } from '../auth/services/users.service';
import { EventsService } from '../events/events.service';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { UserDto } from '../auth/dtos/user.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private eventsService: EventsService,
  ) {}

  async createBooking(bookingBody: CreateBookingDto) {
    const session = await this.connection.startSession();
    let booking: Document;

    try {
      await session.withTransaction(async () => {
        const user = await this.usersService.findOneById(
          bookingBody.user.toString(),
        );
        if (!user) {
          throw new NotFoundException('User is not found');
        }

        const event = await this.eventsService.getEvent(bookingBody.event);

        if (!event) {
          throw new NotFoundException('Event is not found');
        }

        const bookingDoc = new this.bookingModel({
          user: user._id,
          event: event._id,
        });
        await bookingDoc.save({ session });
        booking = bookingDoc;
      });

      return booking;
    } catch (err) {
      throw new NotFoundException('Failed to create booking');
    } finally {
      await session.endSession();
    }
  }

  async getAllBookings() {
    const bookings = await this.bookingModel.find();

    if (!bookings) {
      throw new NotFoundException('Bookings are not found');
    }

    return bookings;
  }

  async getBooking(bookingId: any) {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking is not found');
    }

    return booking;
  }

  async getUserBookings(userId: string) {
    const bookings = await this.bookingModel.find({
      user: new mongoose.Types.ObjectId(userId),
    });

    return bookings;
  }

  async updateBooking(bookingId: string, updatedBody: UpdateBookingDto) {
    const booking = await this.bookingModel.findByIdAndUpdate(
      bookingId,
      updatedBody,
      {
        runValidators: true,
        new: true,
      },
    );

    if (booking) {
      throw new NotFoundException('Booking is not found');
    }
    return booking;
  }

  async deleteBooking(bookingId: string, currentUser: UserDto) {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking is not found');
    }

    await this.bookingModel.deleteOne(booking._id);

    return 'Booking is been deleted';
  }

  async deleteAllUserBookings(userId: string) {
    await this.bookingModel.deleteMany({
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  async deleteAllBookings() {
    await this.bookingModel.deleteMany();
  }
}
