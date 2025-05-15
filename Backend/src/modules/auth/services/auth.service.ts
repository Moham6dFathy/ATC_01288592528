import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../dtos/user.dto';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  async register(
    userInfo: CreateUserDto,
  ): Promise<{ access_token: string; refresh_token: string; user: UserDto }> {
    //Hash a password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userInfo.password, salt);

    userInfo.password = hash;

    const user = await this.userModel.create(userInfo);

    const payload = { sub: user._id, email: user.email };

    const access_token = this.generateAccessToken(payload);

    const refresh_token = this.jwtService.sign(
      { id: user._id },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>(
          'JWT_RERFRESH_TOKEN_EXPIRES_IN',
        ),
      },
    );

    user.refreshToken = refresh_token;
    await user.save();

    return {
      access_token,
      refresh_token,
      user: plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string; user: UserDto }> {
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new BadRequestException(
        'email is not exist!,please register first',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const passwordValidation = await bcrypt.compare(password, hash);

    if (!passwordValidation) {
      throw new BadRequestException();
    }

    const payload = { sub: user._id, email: user.email };

    return {
      access_token: this.generateAccessToken(payload),
      refresh_token: user.refreshToken,
      user: plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  logout(request: Request, response: Response): Response {
    if (request.cookies?.['jwt_token']) {
      response.clearCookie('jwt_token');
      return response.json({ message: 'You are log out' });
    }

    response.json({ message: 'Logout was failed,try again!' });
  }
}
