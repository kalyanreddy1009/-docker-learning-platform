import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({ data });
    // Auto-create a profile with 0 XP when a user is registered
    await this.prisma.profile.create({
      data: {
        userId: user.id,
        xp: 0,
        streak: 0,
      },
    });
    return user;
  }

  async getDashboardStats(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const progress = await this.prisma.progress.findMany({
      where: { userId },
      include: { lesson: true },
      orderBy: { completedAt: 'desc' },
      take: 5,
    });

    const completedLabs = progress.filter(
      (p) => p.status === 'COMPLETED',
    ).length;
    const totalXp = profile?.xp || 0;

    return {
      stats: {
        completedLabs,
        totalXp,
        streak: profile?.streak || 0,
      },
      recentActivity: progress.map((p) => ({
        id: p.id,
        title: `Completed: ${p.lesson.title}`,
        type: p.lesson.type,
        points: `+${p.lesson.xpReward}`,
        date: p.completedAt?.toISOString(),
        status: p.status === 'COMPLETED' ? 'success' : 'in-progress',
      })),
    };
  }

  async addXp(userId: string, xpToAdd: number) {
    return this.prisma.profile.update({
      where: { userId },
      data: { xp: { increment: xpToAdd } },
    });
  }

  async markLessonCompleted(userId: string, lessonId: string) {
    // Check if progress exists
    let prog = await this.prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (!prog || prog.status !== 'COMPLETED') {
      prog = await this.prisma.progress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: {
          userId,
          lessonId,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
        update: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      // Award XP
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
      });
      if (lesson) {
        await this.addXp(userId, lesson.xpReward);
      }
    }
    return prog;
  }
}
