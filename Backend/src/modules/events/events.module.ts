import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { AuthModule } from '../auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: 'Category', schema: CategorySchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => BookingModule),
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtService, ConfigService],
  exports: [EventsService],
})
export class EventsModule {}
