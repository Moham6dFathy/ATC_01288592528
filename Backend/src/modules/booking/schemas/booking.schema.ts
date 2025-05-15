import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Booking {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'booking must belong to user'],
  })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Booking must belong to event'],
  })
  event: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: ['Credit Card', 'Paypal', 'Vodafone Cash'],
    default: 'Credit Card',
  })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
  })
  status: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ event: 1, user: -1 }, { unique: true });

BookingSchema.pre('find', function (next) {
  this.populate({
    path: 'event',
    select: 'name venue date price image',
  }).populate({
    path: 'user',
    select: 'name email',
  });
  next();
});

BookingSchema.pre('findOne', function (next) {
  this.populate({
    path: 'event',
    select: 'name venue date price image',
  }).populate({
    path: 'user',
    select: 'name email',
  });
  next();
});
