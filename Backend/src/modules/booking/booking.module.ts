import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventSchema } from '../events/schemas/event.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: 'Event', schema: EventSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule,
    EventsModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, JwtService, ConfigService],
})
export class BookingModule {}
