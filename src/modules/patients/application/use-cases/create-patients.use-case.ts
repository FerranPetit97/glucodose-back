import { Inject, Injectable } from '@nestjs/common';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '@patients/domain/repositories/patients.repository';
import { Patients } from '@patients/domain/entities/patients.entity';
import { CreatePatientsDto } from '../dtos/create-patients.dto';

@Injectable()
export class CreatePatientsUseCase {
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) { }

  async execute(dto: CreatePatientsDto): Promise<Patients> {
    const patient = Patients.create(
      dto.name,
      dto.email,
      dto.phone,
      dto.dob,
      dto.diagnosis_date,
      dto.type_diabetes,
    );

    return await this.patientsRepository.save(patient);

  }
}
