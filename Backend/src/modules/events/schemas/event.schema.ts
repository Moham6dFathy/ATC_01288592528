import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Event {
  @Prop({
    type: String,
    required: [true, 'Name is required field'],
    unique: [true, 'Name must be unique!'],
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Category',
  })
  category: mongoose.Types.ObjectId;

  @Prop({
    type: Date,
    required: [true, 'Event must have a Date'],
  })
  date: Date;

  @Prop({
    type: String,
    required: [true, 'Event must have a Venue'],
  })
  venue: string;

  @Prop({
    type: Number,
    required: [true, 'Event must have a Price'],
    min: 1,
    max: 1000000,
  })
  price: number;

  @Prop({
    type: String,
  })
  image: String;

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

export const EventSchema = SchemaFactory.createForClass(Event);
