import { CreatePatientsDto } from '@patients/application/dtos/create-patients.dto';
import { UpdatePatientsDto } from '@patients/application/dtos/update-patients.dto';
import { Patients } from '../entities/patients.entity';

export const PATIENTS_REPOSITORY = Symbol('PatientsRepository');

export interface PatientsRepository {
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{ data: Patients[]; total: number; page: number; limit: number }>;
  findById(id: string): Promise<Patients | null>;
  save(foods: CreatePatientsDto): Promise<Patients>;
  updateById(id: string, dto: UpdatePatientsDto): Promise<Patients>;
}
