import { Exclude, Expose, Type } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { UserDto } from 'src/modules/auth/dtos/user.dto';
import { EventDto } from 'src/modules/events/dtos/event.dto';

export class BookingDetailDto {
  @Expose({ name: 'id' })
  id: any;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  paymentMethod: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  __v: any;
}
