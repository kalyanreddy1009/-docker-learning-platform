import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me/dashboard')
  async getDashboard(@Req() req: RequestWithUser) {
    // req.user is populated by JwtStrategy
    return this.usersService.getDashboardStats(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me/progress/complete')
  async completeLesson(
    @Req() req: RequestWithUser,
    @Body('lessonId') lessonId: string,
  ) {
    return this.usersService.markLessonCompleted(req.user.id, lessonId);
  }
}
