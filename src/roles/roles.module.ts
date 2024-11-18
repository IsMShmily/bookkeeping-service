import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [TypeOrmModule, RolesService],
})
export class RolesModule {}
