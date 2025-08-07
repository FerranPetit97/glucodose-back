import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository
} from '@patients/domain/repositories/patients.repository';
import { Patients } from '@patients/domain/entities/patients.entity';
import { UpdatePatientsDto } from '../dtos/update-patients.dto';

@Injectable()
export class UpdatePatientsUseCase {
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) { }

  async execute(id: string, dto: UpdatePatientsDto): Promise<Patients> {
    const existing = await this.patientsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }

    const updated = await this.patientsRepository.updateById(id, dto);

    return updated;
  }
}
