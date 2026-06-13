import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TerminalModule } from '../terminal/terminal.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, TerminalModule, UsersModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
