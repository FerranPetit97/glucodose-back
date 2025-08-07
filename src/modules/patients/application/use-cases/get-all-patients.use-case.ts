import { Inject, Injectable } from '@nestjs/common';
import { Patients } from '@patients/domain/entities/patients.entity';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '@patients/domain/repositories/patients.repository';

@Injectable()
export class GetAllPatientsUseCase {
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) { }

  async execute(
    page = 1,
    limit = 10,
  ): Promise<{ data: Patients[]; total: number; page: number; limit: number }> {
    return this.patientsRepository.findAll(page, limit);
  }
}
