import { Expose } from 'class-transformer';

export class SigninUserVo {
  @Expose()
  userName: string;
  @Expose()
  password: string;
}
