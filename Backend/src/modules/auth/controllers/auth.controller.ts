import {
  Body,
  ConsoleLogger,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../dtos/user.dto';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { plainToClass, plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  setTokenInCookies(response: Response, token: any) {
    const maxAge =
      parseInt(this.configService.get<string>('COOKIES_EXPIRES')) * 1000;

    const cookieOptions = {
      maxAge,
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    };

    return response.cookie('jwt_token', token, cookieOptions);
  }

  @Post('/register')
  async register(
    @Body() body: CreateUserDto,
    @Res() response: Response,
  ): Promise<void> {
    const userInfo = body;
    const newUser = await this.authService.register(userInfo);

    this.setTokenInCookies(response, newUser.access_token);

    response.json(newUser);
  }

  @Post('/signin')
  async signin(
    @Res() response: Response,
    @Body() body: { email: string; password: string },
  ): Promise<void> {
    const { email, password } = body;

    const user = await this.authService.signIn(email, password);

    this.setTokenInCookies(response, user.access_token);

    response.json(user);
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  currentUser(@CurrentUser() me: UserDto) {
    return plainToInstance(UserDto, me, {
      excludeExtraneousValues: true,
    });
  }
}
