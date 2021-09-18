import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './entities/message.entity';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), AuthenticationModule, UsersModule],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
