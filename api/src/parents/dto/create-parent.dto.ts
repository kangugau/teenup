import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateParentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  email: string;
}
