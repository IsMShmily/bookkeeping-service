import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface getUserDto {
  page: number;
  size: number;
  userName: string;
  gender: number;
  role: number;
}

export class getUserbyIdDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  userName?: string;
}
