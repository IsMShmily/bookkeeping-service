import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Inject,
  LoggerService,
  Body,
  Headers,
  Query,
  UseFilters,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserbyIdDto, getUserDto } from './dto/user.dto';
import { TypormFiletr } from '../filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { createUserDto } from './dto/create-user.dto';
import { AdminGuard } from '../guards/admin/admin.guard';
import { JwtGuard } from 'src/guards/admin/jwt.guard';

@Controller('user')
@UseFilters(new TypormFiletr())
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(@Query() query: getUserDto): any {
    console.log('%c query ：', 'color:red', query);
    return this.userService.findAll(query);
  }

  @Get('/profile')
  @UseGuards(JwtGuard, AdminGuard)
  getUserProfile(
    @Headers() headers,
    @Query() query: getUserbyIdDto,
    @Req() req,
  ): any {
    return this.userService.findProfile(query.id);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  addUser(@Body(CreateUserPipe) body: createUserDto): any {
    const user = {
      username: body.userName,
      password: body.password,
      roles: body.roles,
    } as User;
    return this.userService.create(user);
  }

  @Patch()
  updateUser(): any {
    // todo 传递参数id
    // todo 异常处理
    const user = { username: 'newname' } as User;
    return this.userService.update(1, user);
  }

  @Delete()
  deleteUser(): any {
    // todo 传递参数id
    return this.userService.remove(1);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    // return res.map((o) => ({
    //   result: o.result,
    //   count: o.count,
    // }));
    return res;
  }
}
