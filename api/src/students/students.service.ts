import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  create(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        ...createStudentDto,
        dob: new Date(createStudentDto.dob),
      },
    });
  }

  findAll() {
    return this.prisma.student.findMany({
      include: { parent: true },
    });
  }

  findOne(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { parent: true },
    });
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: {
        ...updateStudentDto,
        dob: updateStudentDto.dob ? new Date(updateStudentDto.dob) : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
