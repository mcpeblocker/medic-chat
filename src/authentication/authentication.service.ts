import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getUserFromAuthenticationToken(token: string) {
      const payload: TokenPayload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (payload.userId) {
        return this.usersService.getById(payload.userId);
      }
      throw new WsException('userId must be provided');
  }
}
