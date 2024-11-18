import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { ExpenditureModule } from './expenditure/expenditure.module';
import { IncomeModule } from './income/income.module';
import { BudgetModule } from './budget/budget.module';
import { BillModule } from './bill/bill.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ExpenditureModule,
    IncomeModule,
    BudgetModule,
    BillModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class ClientModule {}
