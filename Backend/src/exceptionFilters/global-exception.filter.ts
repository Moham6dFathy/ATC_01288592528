import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

class AppError extends HttpException {
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.isOperational = true;
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || 'Internal server error';

    if (process.env.NODE_ENV === 'development') {
      return response.status(status).json({
        status: exception.status || 'error',
        error: exception.response,
        message: message,
        stack: exception.stack,
      });
    }

    let error = {
      ...exception,
      name: exception.name,
      message: exception.message,
    };

    if (error.name === 'CastError') error = this.handleCastErrorDB(error);
    if (error.code === 11000) error = this.handleDuplicateField(error);
    if (error.name === 'ValidationError')
      error = this.handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = this.handleJwtError();
    if (error.name === 'TokenExpiredError')
      error = this.handleJwtExpiredError();

    if (request.originalUrl.startsWith('/api')) {
      if (error.isOperational) {
        return response.status(error.getStatus()).json({
          status: error.status || 'error',
          message: error.message,
        });
      }
      console.error('Error 💥', error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    } else {
      if (error.isOperational) {
        return response.status(error.getStatus()).render('error', {
          title: 'Something went wrong',
          msg: error.message,
        });
      }
      console.error('Error 💥', error);
      return response.status(error.getStatus()).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later!',
      });
    }
  }

  private handleDuplicateField(err: any) {
    const value = err.message.match(/"(.*?)"/)[0];
    const message = `Duplicated field value: ${value}. Please use another value!`;
    return new AppError(message, HttpStatus.BAD_REQUEST);
  }

  private handleCastErrorDB(err: any) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, HttpStatus.BAD_REQUEST);
  }

  private handleValidationErrorDB(err: any) {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, HttpStatus.BAD_REQUEST);
  }

  private handleJwtError() {
    return new AppError(
      'Invalid token, please log in again!',
      HttpStatus.UNAUTHORIZED,
    );
  }

  private handleJwtExpiredError() {
    return new AppError(
      'Your token has expired, please log in again!',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
