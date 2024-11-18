import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { createUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: createUserDto, metadata: ArgumentMetadata) {
    console.log(
      '%c 🐞~~ value ：',
      'color:#fff;background:red;border-radius:3px',
      value,
    );
    if (value.roles && value.roles instanceof Array && value.roles.length > 0) {
      if (value.roles[0]['id']) {
        value.roles = value.roles.map((item) => item.id);
      }
    }

    return value;
  }
}
