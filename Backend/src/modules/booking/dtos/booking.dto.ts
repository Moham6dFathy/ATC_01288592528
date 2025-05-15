import { Exclude, Expose, Type } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { UserDto } from 'src/modules/auth/dtos/user.dto';
import { EventDto } from 'src/modules/events/dtos/event.dto';

export class BookingDto {
  @Expose({ name: 'id' })
  id: any;

  @Expose()
  user: string;

  @Expose()
  event: string;

  @Expose()
  paymentMethod: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  __v: any;
}
