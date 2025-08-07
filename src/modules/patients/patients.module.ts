import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { PatientsOrmEntity } from './infrastructure/adapters/out/orm/entities/patients.orm-entity';
import { PatientsOrmRepository } from './infrastructure/adapters/out/orm/repositories/patients.orm-repository';
import { FoodsController } from './infrastructure/adapters/in/controllers/foods.controller';
import { GetAllPatientsUseCase } from './application/use-cases/get-all-patients.use-case';
import { GetPatientsByIdUseCase } from './application/use-cases/get-patients-by-id.use-case';
import { CreatePatientsUseCase } from './application/use-cases/create-patients.use-case';
import { UpdatePatientsUseCase } from './application/use-cases/update-patients.use-case';

import { PATIENTS_REPOSITORY } from './domain/repositories/patients.repository';

@Module({
  imports: [
    MikroOrmModule.forFeature([PatientsOrmEntity]),
  ],
  providers: [
    { provide: PATIENTS_REPOSITORY, useClass: PatientsOrmRepository },
    GetAllPatientsUseCase,
    GetPatientsByIdUseCase,
    CreatePatientsUseCase,
    UpdatePatientsUseCase,
  ],
  controllers: [FoodsController],
  exports: [
    { provide: PATIENTS_REPOSITORY, useClass: PatientsOrmRepository },
    GetAllPatientsUseCase,
    GetPatientsByIdUseCase,
    CreatePatientsUseCase,
    UpdatePatientsUseCase,
  ],
})
export class PatientsModule { }
