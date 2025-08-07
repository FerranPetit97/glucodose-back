import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository
} from '@patients/domain/repositories/patients.repository';
import { Patients } from '@patients/domain/entities/patients.entity';

@Injectable()
export class GetPatientsByIdUseCase {
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) { }

  async execute(id: string): Promise<Patients> {
    const foods = await this.patientsRepository.findById(id);
    if (!foods) throw new NotFoundException(`Foods with ID ${id} not found`);
    return foods;
  }
}
