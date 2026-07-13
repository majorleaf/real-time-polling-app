import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

// @WebSocketGateway opens a socket server on the same port as our app
// cors: true allows our CLI client to connect without security blocks
@WebSocketGateway({ cors: true })
export class PollGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // This triggers automatically the moment a client connects
  handleConnection(client: Socket) {
    console.log(`\n[Server] 🟢 A client connected! Their ID is: ${client.id}`);
  }

  // This triggers automatically when a client closes their app/terminal
  handleDisconnect(client: Socket) {
    console.log(`\n[Server] 🔴 A client disconnected! ID: ${client.id}`);
  }
}
