import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// @WebSocketGateway opens a socket server on the same port as our app
// cors: true allows our CLI client to connect without security blocks
@WebSocketGateway({ cors: true })
export class PollGateway implements OnGatewayConnection, OnGatewayDisconnect {
  //grabs raw socket.io server to broadcast to everyone
  @WebSocketServer()
  server!: Server;

  private pollData: Record<string, number> = {
    NestJS: 0,
    Express: 0,
    Fastify: 0,
  };
  // This triggers automatically the moment a client connects
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

  @SubscribeMessage('VOTE')
  handleVote(@MessageBody() option: string, @ConnectedSocket() client: Socket) {
    console.log(`\n[Server]  Vote received for: "${option}" from ${client.id}`);

    if (this.pollData[option] !== undefined) {
      this.pollData[option] += 1;

      // Broadcast the new totals to connected clients
      this.server.emit('POLL_UPDATE', this.pollData);
    } else {
      // send an error only back to the person who made the mistake
      client.emit('ERROR', `Option '${option}' does not exist. `);
    }
  }
}
