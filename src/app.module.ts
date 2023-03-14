import { Module } from '@nestjs/common';
import { SocketClientModule } from './socket-client/socket-client.module';

@Module({
  imports: [SocketClientModule],
})
export class AppModule {}
