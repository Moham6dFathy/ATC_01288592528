import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import mongoose, { ClientSession, Model } from 'mongoose';
import { CreateEventDto } from './dtos/create-event.dto';
import { EventDetailsDto } from './dtos/event-details.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  //TODO Handle Upload Images
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'src', 'uploads');
    // Ensure the uploads folder exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.originalname);

    // Save the file
    await fs.writeFile(filePath, file.buffer);

    // Return relative path
    return `src/uploads/${file.originalname}`;
  }

  async createEvent(event: CreateEventDto, image?: Express.Multer.File) {
    if (image) {
      const storedPath = await this.uploadFile(image);
      event.image = storedPath;
    }

    const newEvent = await this.eventModel.create(event);

    return newEvent;
  }

  async getAllEvents(queryString: any) {
    const filter = queryString;

    return await this.eventModel.find(filter);
  }

  async getEvent(id: any) {
    const event = (await this.eventModel.findById(id)).populate('category');

    if (!event) {
      throw new NotFoundException('Event is not Found');
    }

    return event;
  }

  async getEventsSpecificToTheCategory(categoryId: string) {
    const events = await this.eventModel.find({
      category: new mongoose.Types.ObjectId(categoryId),
    });

    if (!events) {
      throw new NotFoundException('Events are not Found');
    }

    return events;
  }

  async updateEvent(
    id: string,
    updatedBody: UpdateEventDto,
    image?: Express.Multer.File,
  ) {
    if (image) {
      const storedPath = await this.uploadFile(image);
      updatedBody.image = storedPath;
    }
    const event = await this.eventModel.findById(id);
    console.log(updatedBody);
    if (!event) {
      throw new NotFoundException('Event is not found');
    }

    Object.assign(event, updatedBody);
    await event.save();
    // console.log(event);

    return event;
  }

  async deleteEvent(id: string, session?: ClientSession) {
    const event = await this.eventModel.findByIdAndDelete(id);

    if (!event) {
      throw new NotFoundException('Event is not found');
    }

    return {
      message: 'Event is been deleted',
    };
  }

  async deleteAllEvents(queryString: any) {
    const filter = queryString;
    return await this.eventModel.deleteMany(filter);
  }
}
