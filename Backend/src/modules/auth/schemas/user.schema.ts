import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { isStrongPassword, isEmail, isDate } from 'validator';
import { Role } from './role.enum';

@Schema()
export class User {
  @Prop({
    type: String,
    required: [true, 'Name of User is required!'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Email is required !'],
    unique: [true, 'Email must be unique !'],
    validate: {
      validator: function (v) {
        return isEmail(v);
      },
      message: 'Email is not correct email!',
    },
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Password is required!'],
    validate: {
      validator: function (v) {
        return isStrongPassword(v);
      },
      message:
        'Password must have minLength 8 and contain at least 1 Uppercase letter and at least 1 Number and at least 1 Symbol',
    },
  })
  password: string;

  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Prop({
    type: String,
  })
  refreshToken: string;

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

export const UserSchema = SchemaFactory.createForClass(User);

//TODO Cascade a user with booking (When user removed all bookings is deleted)
