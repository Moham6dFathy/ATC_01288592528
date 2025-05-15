import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateEventDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsString()
  category: mongoose.Types.ObjectId;

  @IsDateString()
  date: Date;

  @IsString()
  venue: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000000)
  price: number;

  @IsOptional()
  @IsString()
  image: string;
}
