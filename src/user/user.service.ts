import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Logs } from '../logs/entities/logs.entity';
import { getUserDto } from './dto/user.dto';
import { conditionUtils } from 'src/utils/db.helper';
import { Roles } from '../roles/entities/roles.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  findAll(query: getUserDto) {
    const { page, size, userName, gender, role } = query;
    const take = size || 10;
    const skip = ((page || 1) - 1) * take;

    /**
 *    return this.userRepository.find({
      select: {
        id: true,
        username: true,
        profile: {
          photo: true,
          address: true,
        },
      },
      where: {
        username: userName,
        profile: {
          gender,
        },
        roles: {
          id: role,
        },
      },
      relations: {
        profile: true,
        roles: true,
      },
      take,
      skip,
    });
 */

    // QueryBuilder 写法
    const obj = {
      'user.username': userName,
      'profile.gender': gender,
      'roles.id': role,
    };
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    return conditionUtils<User>(queryBuilder, obj)
      .take(take)
      .skip(skip)
      .getMany();
  }

  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    if (!user.roles) {
      const role = await this.rolesRepository.findOne({
        where: { id: 2 },
      });
      user.roles = [role];
    }
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }
    const userTmp = await this.userRepository.create(user);
    userTmp.password = await argon2.hash(userTmp.password);
    return this.userRepository.save(userTmp);
  }

  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user,
      },
      // relations: {
      //   user: true,
      // },
    });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;
    // return this.logsRepository.query(
    //   'SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result',
    // );
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .orderBy('count', 'DESC')
        .addOrderBy('result', 'DESC')
        .offset(2)
        .limit(3)
        // .orderBy('result', 'DESC')
        .getRawMany()
    );
  }
}
