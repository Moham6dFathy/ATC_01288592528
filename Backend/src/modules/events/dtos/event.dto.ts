import { Expose, Type } from 'class-transformer';
import { CategoryDto } from 'src/modules/category/dtos/category.dto';

export class EventDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose()
  name: string;

  @Expose()
  date: string;

  @Expose()
  venue: string;

  @Expose()
  price: string;

  @Expose()
  image: string;

  @Expose()
  slug: string;
}
