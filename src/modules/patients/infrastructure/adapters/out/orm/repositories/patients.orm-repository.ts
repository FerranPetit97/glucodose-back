import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Patients } from '@patients/domain/entities/patients.entity';
import { PatientsRepository } from '@patients/domain/repositories/patients.repository';
import { CreatePatientsDto } from '@patients/application/dtos/create-patients.dto';
import { PatientsOrmEntity } from '../entities/patients.orm-entity';

@Injectable()
export class PatientsOrmRepository implements PatientsRepository {
  constructor(private readonly em: EntityManager) { }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Patients[]; total: number; page: number; limit: number }> {
    const [patientsOrm, total] = await this.em.findAndCount(
      PatientsOrmEntity,
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );

    return {
      data: patientsOrm.map((patientOrm) => {
        return Patients.fromPersistence(
          patientOrm.id,
          patientOrm.name,
          patientOrm.email,
          patientOrm.phone,
          patientOrm.dob,
          patientOrm.diagnosis_date,
          patientOrm.type_diabetes,
        );
      }),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Patients | null> {
    const patientOrm = await this.em.findOne(PatientsOrmEntity, id, {
    });
    if (!patientOrm) return null;

    return Patients.fromPersistence(
      patientOrm.id,
      patientOrm.name,
      patientOrm.email,
      patientOrm.phone,
      patientOrm.dob,
      patientOrm.diagnosis_date,
      patientOrm.type_diabetes,
    );
  }

  async save(patient: Patients): Promise<Patients> {
    try {
      let ormEntity: PatientsOrmEntity;

      if (patient.id) {
        const existing = await this.em.findOne(PatientsOrmEntity, { id: patient.id });

        if (!existing) {
          throw new Error(`No se encontró Food con id ${patient.id}`);
        }

        this.em.assign(existing, {
          name: patient.name,
          email: patient.email,
          phone: Number(patient.phone),
          dob: patient.dob,
          diagnosis_date: Number(patient.diagnosis_date),
          type_diabetes: Number(patient.type_diabetes),
        });

        ormEntity = existing;
      } else {
        ormEntity = PatientsOrmEntity.fromDomain(patient);
        this.em.persist(ormEntity);
      }

      await this.em.flush();
      return ormEntity.toDomain();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error guardando patient:', error.message);
        throw error;
      }
      console.error('Error desconocido al guardar patient:', error);
      throw new Error('Error desconocido al guardar patient');
    }
  }

  async updateById(id: string, dto: CreatePatientsDto): Promise<Patients> {
    return this.em.transactional(async (transactionalEntityManager) => {
      const existing = await transactionalEntityManager.findOne(
        PatientsOrmEntity,
        id,
      );

      if (!existing) {
        throw new NotFoundException(`Patient with id ${id} not found`);
      }

      transactionalEntityManager.assign(existing, {
        name: dto.name ?? existing.name,
        email: dto.email ?? existing.email,
        phone: dto.phone !== undefined ? Number(dto.phone) : Number(existing.phone),
        dob: dto.dob ?? existing.dob,
        diagnosis_date: dto.diagnosis_date !== undefined ? Number(dto.diagnosis_date) : Number(existing.diagnosis_date),
        type_diabetes: dto.type_diabetes !== undefined ? Number(dto.type_diabetes) : Number(existing.type_diabetes),
      });

      await transactionalEntityManager.flush();

      return existing.toDomain();
    });
  }
}
