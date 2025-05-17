import { Expose, Type } from 'class-transformer';
import { CategoryDto } from 'src/modules/category/dtos/category.dto';

export class EventDetailsDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  date: Date;

  @Expose()
  venue: string;

  @Expose()
  price: number;

  @Expose()
  image: string;

  @Expose()
  slug: string;
}
