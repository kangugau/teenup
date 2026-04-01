import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  dayOfWeek: string;

  @IsString()
  @IsNotEmpty()
  timeSlot: string;

  @IsString()
  @IsNotEmpty()
  teacherName: string;

  @IsInt()
  @Min(1)
  maxStudents: number;
}
