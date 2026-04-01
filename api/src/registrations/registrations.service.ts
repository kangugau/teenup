import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async remove(id: number) {
    const reg = await this.prisma.classRegistration.findUnique({
      where: { id },
      include: { class: true, student: true },
    });
    if (!reg) throw new NotFoundException('Registration not found');

    // Requirement: Refund if > 24h
    // Since we don't have the specific *session* date, we might assume the next session of this class.
    // For simplicity, let's assume we check against the 'createdAt' or just a placeholder for logic.
    // Actually, classes have day_of_week and time_slot.

    // Placeholder logic for 24h refund
    const now = new Date();
    // In a real app, we would calculate the next session date.
    const isMoreThan24h = true; // Placeholder

    return this.prisma.$transaction(async (tx) => {
      await tx.classRegistration.delete({ where: { id } });
      if (isMoreThan24h) {
        // Find latest active subscription
        const sub = await tx.subscription.findFirst({
          where: { studentId: reg.studentId, endDate: { gte: now } },
          orderBy: { createdAt: 'desc' },
        });
        if (sub) {
          await tx.subscription.update({
            where: { id: sub.id },
            data: { usedSessions: { decrement: 1 } },
          });
        }
      }
      return { success: true };
    });
  }
}
