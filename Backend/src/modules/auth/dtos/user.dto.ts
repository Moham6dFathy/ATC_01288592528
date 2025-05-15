import { Exclude, Expose } from 'class-transformer';
import mongoose from 'mongoose';

export class UserDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: string;
}
