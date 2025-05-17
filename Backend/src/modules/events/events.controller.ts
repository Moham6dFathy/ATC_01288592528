import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  UseGuards,
  Param,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { EventDto } from './dtos/event.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateEventDto } from './dtos/create-event.dto';
import { EventsService } from './events.service';
import { EventDetailsDto } from './dtos/event-details.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { UpdateEventDto } from './dtos/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createEvent(
    @Body() body: CreateEventDto,
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
    return this.eventService.createEvent(body, image);
  }

  @Serialize(EventDto)
  @Get()
  getAllEvents(@Query() queryString: any) {
    return this.eventService.getAllEvents(queryString);
  }

  @Serialize(EventDetailsDto)
  @Get('/:eventId')
  getEvent(@Param('eventId') eventId: string) {
    return this.eventService.getEvent(eventId);
  }

  @Serialize(EventDto)
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/:eventId')
  updateEvent(
    @Param('eventId') eventId: string,
    @Body() updatedBody: UpdateEventDto,
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
    return this.eventService.updateEvent(eventId, updatedBody, image);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(204)
  @Delete('/:eventId')
  deleteEvent(@Param('eventId') eventId: string) {
    return this.eventService.deleteEvent(eventId);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(204)
  @Delete()
  deleteAllEvents(@Query() queryString: any) {
    return this.eventService.deleteAllEvents(queryString);
  }
}
