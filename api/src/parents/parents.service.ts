import { Injectable } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  create(createParentDto: CreateParentDto) {
    return this.prisma.parent.create({
      data: createParentDto,
    });
  }

  findAll() {
    return this.prisma.parent.findMany();
  }

  findOne(id: number) {
    return this.prisma.parent.findUnique({
      where: { id },
    });
  }

  update(id: number, updateParentDto: UpdateParentDto) {
    return this.prisma.parent.update({
      where: { id },
      data: updateParentDto,
    });
  }

  remove(id: number) {
    return this.prisma.parent.delete({
      where: { id },
    });
  }
}
