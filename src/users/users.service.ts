import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new WsException('User does not exist')
  }
}
