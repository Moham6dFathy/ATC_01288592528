import { IsBoolean } from 'class-validator';

export class UpdateBookingDto {
  @IsBoolean()
  status: string;
}
