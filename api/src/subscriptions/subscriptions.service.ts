import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        ...createSubscriptionDto,
        startDate: new Date(createSubscriptionDto.startDate),
        endDate: new Date(createSubscriptionDto.endDate),
        usedSessions: 0,
      },
    });
  }

  useSession(id: number) {
    return this.prisma.subscription.update({
      where: { id },
      data: { usedSessions: { increment: 1 } },
    });
  }

  findAll() {
    return this.prisma.subscription.findMany({
      include: { student: true },
    });
  }

  findOne(id: number) {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: { student: true },
    });
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.prisma.subscription.update({
      where: { id },
      data: {
        ...updateSubscriptionDto,
        startDate: updateSubscriptionDto.startDate
          ? new Date(updateSubscriptionDto.startDate)
          : undefined,
        endDate: updateSubscriptionDto.endDate
          ? new Date(updateSubscriptionDto.endDate)
          : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.subscription.delete({
      where: { id },
    });
  }
}
