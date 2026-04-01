import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async register(classId: number, studentId: number) {
    // 1. Check max_students
    const targetClass = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!targetClass) throw new Error('Class not found');
    if (targetClass._count.registrations >= targetClass.maxStudents) {
      throw new Error('Class reached max_students');
    }

    // 2. Check schedule overlap
    const studentRegistrations = await this.prisma.classRegistration.findMany({
      where: { studentId },
      include: { class: true },
    });
    const hasOverlap = studentRegistrations.some(
      (reg) =>
        reg.class.dayOfWeek === targetClass.dayOfWeek &&
        reg.class.timeSlot === targetClass.timeSlot,
    );
    if (hasOverlap) throw new Error('Student has another class at this time');

    // 3. Check subscription
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        studentId,
        endDate: { gte: new Date() },
        usedSessions: { lt: this.prisma.subscription.fields.totalSessions },
      },
    });
    if (!subscription) throw new Error('No valid subscription found');

    // Register and use 1 session
    return this.prisma.$transaction(async (tx) => {
      const reg = await tx.classRegistration.create({
        data: { classId, studentId },
      });
      await tx.subscription.update({
        where: { id: subscription.id },
        data: { usedSessions: { increment: 1 } },
      });
      return reg;
    });
  }

  create(createClassDto: CreateClassDto) {
    return this.prisma.class.create({
      data: createClassDto,
    });
  }

  findAll(day?: string) {
    return this.prisma.class.findMany({
      where: day ? { dayOfWeek: day } : {},
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.class.findUnique({
      where: { id },
      include: {
        registrations: {
          include: { student: true },
        },
      },
    });
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return this.prisma.class.update({
      where: { id },
      data: updateClassDto,
    });
  }

  remove(id: number) {
    return this.prisma.class.delete({
      where: { id },
    });
  }
}
