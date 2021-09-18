import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user.isAdmin) {
      socket.join(`${user.id}`);
    } else {
      // this.joinAllChats(socket);
    }
    console.log(socket.rooms);
  }

  private joinAllChats(connection: Socket) {
    for (const [id, socket] of this.server.of('/').sockets) {
      socket.rooms.forEach((room) => {
        connection.join(room);
      });
    }
    return [];
  }

  @SubscribeMessage('admin:chats')
  async getChats(@ConnectedSocket() socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (user.isAdmin) {
      // this.joinAllChats(socket);
      console.log(socket.rooms);
    }
  }

  @SubscribeMessage('admin:message')
  async handleAdminMessage(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (user.isAdmin) {
      const receiver = await this.chatService.getUserById(data.to, socket);
      const message = await this.chatService.saveMessage(data.message, receiver, false);
      socket.to(message.user.id.toString())
    }
    socket.to(`${data.to}`).emit('receive_message', data.message);
  }

  @SubscribeMessage('client:message')
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(data, user, true);
    console.log(message);
    socket.to(message.user.id.toString()).emit('receive_message', message);
    return data;
  }
}
