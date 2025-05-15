import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CategoryDto } from './dtos/category.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { EventDetailsDto } from '../events/dtos/event-details.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Serialize(CategoryDto)
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  createCategory(
    @Body() category: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.categoryService.createCategory(category, image);
  }

  @Serialize(CategoryDto)
  @Get()
  getMainCategories() {
    return this.categoryService.getMainCategories();
  }

  @Serialize(CategoryDto)
  @Get('/all')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Serialize(CategoryDto)
  @Get('/:categoryId')
  getCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.getCategory(categoryId);
  }

  @Serialize(CategoryDto)
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('/:categoryId')
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updatedBody: CreateCategoryDto,
  ) {
    return this.categoryService.updateCategory(categoryId, updatedBody);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(204)
  @Delete('/:categoryId')
  deleteCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId);
  }

  @HttpCode(204)
  @Delete()
  deleteAllCategories() {
    return this.categoryService.deleteAllCategories();
  }

  @Serialize(EventDetailsDto)
  @Get('/:categoryId/events')
  async getEventsOfCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.getAllEventsOfCategory(categoryId);
  }

  @Delete()
  deleteManyCategories(@Query('category_ids') category_ids: any[]) {
    return this.categoryService.deleteManyCategories(category_ids);
  }
}
