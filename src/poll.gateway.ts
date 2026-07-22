import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { PollService } from './poll.service';
import { Server, Socket } from 'socket.io';

// @WebSocketGateway opens a socket server on the same port as our app
// cors: true allows our CLI client to connect without security blocks
@WebSocketGateway({ cors: true })
export class PollGateway implements OnGatewayConnection, OnGatewayDisconnect {
  //grabs raw socket.io server to broadcast to everyone
  @WebSocketServer()
  server!: Server;

  constructor(private readonly pollService: PollService) {}

  handleConnection(client: Socket) {
    // sends perfectly bshaped data as soon as they are connected
    client.emit('POLL_UPDATE', this.pollService.getPoll());
  }
  handleDisconnect(client: Socket) {
    console.log(`\n[Server] 🔴 A client disconnected! ID: ${client.id}`);
  }

  @SubscribeMessage('GET_POLL_STATUS')
  handleGetStatus(client: Socket) {
    client.emit('POLL_UPDATE', this.pollService.getPoll());
  }

  @SubscribeMessage('VOTE')
  handleVote(@MessageBody() option: string, @ConnectedSocket() client: Socket) {
    const result = this.pollService.vote(option);

    if (result.success) {
      this.server.emit('POLL_UPDATE', result.poll);
    } else {
      client.emit('ERROR', result.message);
    }
  }

  @SubscribeMessage('CREATE_POLL')
  handleCreatePoll(@MessageBody() newTitle: string) {
    const newPoll = this.pollService.createPoll(newTitle);
    this.server.emit('POLL_UPDATE', newPoll);
  }
}
