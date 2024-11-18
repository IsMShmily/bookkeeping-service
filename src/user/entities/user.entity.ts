import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Logs } from '../../logs/entities/logs.entity';
import { Roles } from '../../roles/entities/roles.entity';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  // typescript -> 数据库 关联关系 Mapping
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
