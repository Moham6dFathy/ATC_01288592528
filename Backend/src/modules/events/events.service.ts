import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import mongoose, { ClientSession, Connection, Model } from 'mongoose';
import { CreateEventDto } from './dtos/create-event.dto';
import { EventDetailsDto } from './dtos/event-details.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import * as path from 'path';
import { promises as fs } from 'fs';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(forwardRef(() => BookingService))
    private bookingService: BookingService,
  ) {}

  //TODO Handle Upload Images
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'src', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.originalname);

    await fs.writeFile(filePath, file.buffer);

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
    const newsession = session || (await this.connection.startSession());
    let createdSession = false;

    if (!session) createdSession = true;

    try {
      await newsession.withTransaction(async () => {
        const event = await this.eventModel.findById(id).session(newsession);

        if (!event) {
          throw new NotFoundException('Event not found');
        }

        // Delete related bookings
        await this.bookingService.deleteBookingByEventId(id, newsession);

        // Delete event itself
        await this.eventModel.deleteOne({ _id: id }, { session: newsession });
      });

      return {
        message: 'Event has been successfully deleted',
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new Error(`Failed to delete event: ${err.message}`);
    } finally {
      if (createdSession) {
        await newsession.endSession();
      }
    }
  }

  async deleteAllEvents(queryString: any) {
    const filter = queryString;
    return await this.eventModel.deleteMany(filter);
  }
}
