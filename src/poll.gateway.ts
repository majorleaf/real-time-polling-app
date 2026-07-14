import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// @WebSocketGateway opens a socket server on the same port as our app
// cors: true allows our CLI client to connect without security blocks
@WebSocketGateway({ cors: true })
export class PollGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // This triggers automatically the moment a client connects

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`\n[Server] 🟢 A client connected! Their ID is: ${client.id}`);
  }

  // This triggers automatically when a client closes their app/terminal
  handleDisconnect(client: Socket) {
    console.log(`\n[Server] 🔴 A client disconnected! ID: ${client.id}`);
  }

  // @SubscribeMessage tells Nest to listen for this exact event name
  @SubscribeMessage('GET_POLL_STATUS')
  handleGetPollStatus(client: Socket) {
    console.log(
      `\n[Server] Received GET_POLL_STATUS request from ${client.id}`,
    );

    //automatic response data
    const currentPoll = { NestJS: 5, Express: 2, Fastify: 1 };

    client.emit('POLL_UPDATE', currentPoll);
  }
}
