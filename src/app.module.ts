import { Module } from '@nestjs/common';
import { PollGateway } from './poll.gateway';
import { PollService } from './poll.service';

@Module({
  imports: [],
  controllers: [],
  // We MUST put PollGateway in the providers array, otherwise
  // NestJS will ignore the file completely and the socket won't open.
  providers: [PollGateway, PollService],
})
export class AppModule {}
