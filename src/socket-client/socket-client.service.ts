import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import * as readline from 'readline';
import { SearchResultDto } from './dto/search-result-dto';

@Injectable()
export class SocketClientService implements OnApplicationBootstrap {
  private apiUrl = 'http://localhost:3000';
  private socketClient: Socket;
  private rl: readline.Interface;

  constructor() {
    this.socketClient = io(this.apiUrl);
  }

  onApplicationBootstrap() {
    this.registerEventListeners();
  }

  registerEventListeners() {
    this.socketClient.on('connect', () => {
      console.log('-- client connected');

      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      this.query();
    });

    this.socketClient.on('error', (err) => {
      console.log(`ERR: ${err}`);
      this.query();
    });

    this.socketClient.on('connect_error', (err) => {
      console.log(`Connection error due to ${err.message}`);
    });

    this.socketClient.on('disconnect', () => {
      this.rl.close();
      console.log('client disconnected');
    });

    this.socketClient.on('search', (res: SearchResultDto) => {
      console.log(this.formatResult(res));

      if (res.resultCount === res.page) {
        this.query();
      }
    });
  }

  query = () => {
    this.rl.question(
      'What character would you like to search for? ',
      (query: string) => {
        if (!query) {
          this.close();
          return;
        }

        console.log(`Searching for ${query}...`);

        this.socketClient.emit('search', { query });
      },
    );
  };

  formatResult = (res: SearchResultDto) => {
    const { page, resultCount, name, films, error } = res;
    if (resultCount !== -1) {
      return `(${page}/${resultCount}) ${name} - [${films}]`;
    } else {
      return `ERR: ${error}`;
    }
  };

  close = () => {
    console.log('I find your lack of faith disturbing.');
    this.socketClient.close();
    process.exit();
  };
}
