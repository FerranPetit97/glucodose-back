import { Patients } from '@patients/domain/entities/patients.entity';

export class PatientsResponseDto {
  id: string;
  name: string;
  email: string;
  phone: number;
  dob: string;
  diagnosis_date: number;
  type_diabetes: number;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: number,
    dob: string,
    diagnosis_date: number,
    type_diabetes: number,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.dob = dob;
    this.diagnosis_date = diagnosis_date;
    this.type_diabetes = type_diabetes;
  }

  static fromDomain(patient: Patients): PatientsResponseDto {
    if (!patient.id) {
      throw new Error(
        'Cannot create response DTO from a domain entity without ID',
      );
    }
    return new PatientsResponseDto(
      patient.id,
      patient.name,
      patient.email,
      Number(patient.phone),
      patient.dob,
      Number(patient.diagnosis_date),
      Number(patient.type_diabetes),
    );
  }
}
