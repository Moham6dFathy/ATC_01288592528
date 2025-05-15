import { IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateBookingDto {
  @IsString()
  user: mongoose.Types.ObjectId;

  @IsString()
  event: mongoose.Types.ObjectId;

  @IsOptional()
  @IsString()
  payment_method: string;
}
