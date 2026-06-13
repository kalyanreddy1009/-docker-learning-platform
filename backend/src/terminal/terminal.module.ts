import { Module } from '@nestjs/common';
import { TerminalGateway } from './terminal.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TerminalGateway],
  exports: [TerminalGateway],
})
export class TerminalModule {}
