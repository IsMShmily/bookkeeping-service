import { IsNotEmpty, IsString, Length } from 'class-validator';
export class SigninUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 20, {
    message: `用户名必须在$constraint1到$constraint2之间，当前值为$value`,
  })
  userName: string;

  @IsNotEmpty()
  password: string;
}

export class SignUpUserDto {
  @IsString()
  userName: string;
  @IsString()
  password: string;
}
