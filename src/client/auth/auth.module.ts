import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    // JWT 相关
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigEnum.SECRET),
        // 全局设置过期时间
        signOptions: {
          expiresIn: '1d', // 1天过期
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
