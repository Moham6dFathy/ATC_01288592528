import { Expose } from 'class-transformer';

export class CategoryDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;
}
