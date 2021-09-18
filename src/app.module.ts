import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    ChatModule,
  ],
})
export class AppModule {}
