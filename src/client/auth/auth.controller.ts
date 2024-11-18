import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto, SignUpUserDto } from './dto/auth.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize/serialize.interceptor';
import { SigninUserVo } from './vo/auth.vo';

@Controller('app/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { userName, password } = dto;
    const token = await this.authService.signin(userName, password);
    return {
      access_token: token,
    };
  }

  @Post('/signup')
  @UseInterceptors(new SerializeInterceptor(SigninUserVo))
  signup(@Body() dto: SignUpUserDto) {
    console.log(
      '%c 🐞~~ dto ：',
      'color:#fff;background:red;border-radius:3px',
      dto,
    );
    return dto;
  }
}
