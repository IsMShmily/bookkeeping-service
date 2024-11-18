import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwt: JwtService,
  ) {}
  async signin(userName, password) {
    const user = await this.userService.find(userName);
    if (!user) {
      throw new ForbiddenException('用户不存在');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }

    return await this.jwt.signAsync(
      {
        username: user.username,
        sub: user.id,
      },
      // 局部设置 过期时间
      // {
      //   expiresIn: '1d',
      // },
    );
  }

  signup(userName, password) {
    return `${userName}--${password}`;
  }
}
