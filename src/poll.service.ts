import { Injectable } from '@nestjs/common';

export interface PollState {
  title: string;
  options: Record<string, number>;
}

@Injectable()
export class PollService {
  private state: PollState = {
    title: 'Favorite Backend Framework',
    options: { Nestjs: 0, Express: 0, Fastify: 0 },
  };

  getPoll(): PollState {
    return this.state;
  }

  createPoll(newTitle: string): PollState {
    this.state = {
      title: newTitle,
      options: {},
    };
    return this.state;
  }

  vote(option: string) {
    if (this.state.options[option] !== undefined) {
      this.state.options[option] += 1;
      return { success: true, poll: this.state };
    }
    return { success: false, message: `Option '${option}' does not exist.` };
  }

  addOption(option: string): PollState {
    if (this.state.options[option] === undefined) {
      this.state.options[option] = 0;
    }
    return this.state;
  }
}
