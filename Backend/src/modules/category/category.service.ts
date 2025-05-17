import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Event } from '../events/schemas/event.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { EventsService } from '../events/events.service';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private eventService: EventsService,
  ) {}

  //TODO Handle Upload Images
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'src', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.originalname);

    await fs.writeFile(filePath, file.buffer);

    return `src/uploads/${file.originalname}`;
  }

  async createCategory(
    category: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    if (image) {
      const storedPath = await this.uploadFile(image);
      category.image = storedPath;
    }
    const newCategory = await this.categoryModel.create(category);
    return newCategory;
  }

  async getMainCategories() {
    const categories = await this.categoryModel.find({ parent: null });

    if (!categories) {
      throw new NotFoundException('Categories not Found');
    }

    return categories;
  }

  async getAllCategories() {
    const categories = await this.categoryModel.find();

    if (!categories) {
      throw new NotFoundException('Categories not Found');
    }

    return categories;
  }

  async getCategory(id: string) {
    const category = await this.categoryModel.find({ _id: id });
    if (!category) {
      throw new NotFoundException('Categories not Found');
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateBody: CreateCategoryDto,
    image?: Express.Multer.File,
  ) {
    if (image) {
      const storedPath = await this.uploadFile(image);
      updateBody.image = storedPath;
    }
    const category = await this.categoryModel.findById(id);

    Object.assign(category, updateBody);
    
    await category.save();

    console.log(updateBody);
    if (!category) {
      throw new NotFoundException('Category not found ');
    }

    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('Categories not Found');
    }
    return 'Category deleted Successfully';
  }

  async deleteAllCategories() {
    return this.categoryModel.deleteMany();
  }

  async getAllEventsOfCategory(categoryId: string) {
    const events =
      await this.eventService.getEventsSpecificToTheCategory(categoryId);

    if (!events) {
      throw new NotFoundException('Events are not found');
    }

    return events;
  }

  async deleteManyCategories(category_ids: any[]): Promise<any> {
    if (!Array.isArray(category_ids) || category_ids.length === 0) {
      throw new Error('category_ids must be a non-empty array');
    }

    return this.categoryModel.deleteMany({ _id: { $in: category_ids } });
  }
}
