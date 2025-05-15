import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import slugify from 'slugify';

@Schema()
export class Category {
  @Prop({
    type: String,
    required: [true, 'Category must have a name'],
    unique: [true, 'Category name must be unique'],
  })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', function () {
  this.slug = slugify(this.name);
});
