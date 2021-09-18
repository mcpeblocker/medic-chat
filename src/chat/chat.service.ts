import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './entities/message.entity';
import { Repository } from 'typeorm';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(content: string, user: User, fromSelf: boolean) {
    const newMessage = await this.messageRepository.create({
      content,
      fromSelf,
      user,
    });
    await this.messageRepository.save(newMessage);
    return newMessage;
  }

  async getUserFromSocket(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    try {
      const user =
        await this.authenticationService.getUserFromAuthenticationToken(token);
      if (user) {
        return user;
      }
    } catch (err) {
      socket._error(err);
    }
  }

  async getUserById(id: number, socket: Socket) {
    try {
      const user = this.usersService.getById(id);
      if (user) {
        return user;
      }
    } catch (e) {
      socket._error(e);
    }
  }
}
