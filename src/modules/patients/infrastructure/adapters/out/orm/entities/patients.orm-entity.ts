import {
  Entity, PrimaryKey,
  Property
} from '@mikro-orm/core';
import { Patients } from '@patients/domain/entities/patients.entity';

@Entity({ tableName: 'patients', schema: 'core_data_patients' })
export class PatientsOrmEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  phone!: number;

  @Property()
  dob!: string;

  @Property()
  diagnosis_date!: number;

  @Property()
  type_diabetes!: number;

  toDomain(): Patients {
    const patientDomain = new Patients(
      this.id,
      this.name,
      this.email,
      this.phone,
      this.dob,
      this.diagnosis_date,
      this.type_diabetes,
    );

    return patientDomain;
  }

  static fromDomain(domain: Patients): PatientsOrmEntity {
    const orm = new PatientsOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.name = domain.name;
    orm.email = domain.email;
    orm.phone = domain.phone;
    orm.dob = domain.dob;
    orm.diagnosis_date = domain.diagnosis_date;
    orm.type_diabetes = domain.type_diabetes;
    return orm;
  }
}
