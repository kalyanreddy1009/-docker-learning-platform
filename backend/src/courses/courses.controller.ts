import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGuard } from '@nestjs/passport';
import { TerminalGateway } from '../terminal/terminal.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly terminalGateway: TerminalGateway,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll() {
    const courses = await this.coursesService.findAll();
    return courses;
  }

  @Get('lesson/:id')
  findLesson(@Param('id') id: string) {
    return this.coursesService.findLesson(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('lesson/:id/verify')
  async verifyLab(@Param('id') lessonId: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;

    // Fetch lesson with lab details
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { lab: true },
    });

    if (!lesson || lesson.type !== 'LAB' || !lesson.lab) {
      throw new BadRequestException('Invalid lab lesson');
    }

    // Get active terminal session for this user
    const session = this.terminalGateway.getSessionByUserId(userId);
    if (!session || !session.commandsRun) {
      return {
        success: false,
        message:
          'No active terminal session found. Please type commands in the terminal first, then verify.',
      };
    }

    // Evaluate validation rules
    const rules = lesson.lab.validationRules as Array<{
      type: string;
      command: string;
    }>;
    let passed = true;

    if (rules && rules.length > 0) {
      for (const rule of rules) {
        if (rule.type === 'command_run') {
          // Check if the required command was executed in the session
          const hasRun = session.commandsRun.some((cmd: string) =>
            cmd.includes(rule.command),
          );
          if (!hasRun) {
            passed = false;
            break;
          }
        }
      }
    } else {
      // Fallback: If no strict rules, just ensure they typed something
      if (session.commandsRun.length === 0) passed = false;
    }

    if (passed) {
      await this.usersService.markLessonCompleted(userId, lessonId);
      return {
        success: true,
        message: 'Lab validated successfully! XP awarded.',
      };
    }

    return {
      success: false,
      message: 'Validation failed. Ensure you ran all required commands.',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.coursesService.findOne(slug);
  }
}
