import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  studentId: number;

  @IsString()
  @IsNotEmpty()
  packageName: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  @Min(1)
  totalSessions: number;
}
