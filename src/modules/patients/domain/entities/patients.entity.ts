export class Patients {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: number,
    public readonly dob: string,
    public readonly diagnosis_date: number,
    public readonly type_diabetes: number,
  ) { }

  static create(
    name: string,
    email: string,
    phone: number,
    dob: string,
    diagnosis_date: number,
    type_diabetes: number,
  ): Patients {
    return new Patients(
      undefined,
      name,
      email,
      Number(phone),
      dob,
      Number(diagnosis_date),
      Number(type_diabetes),
    );
  }

  static fromPersistence(
    id: string,
    name: string,
    email: string,
    phone: number,
    dob: string,
    diagnosis_date: number,
    type_diabetes: number,
  ): Patients {
    return new Patients(
      id,
      name,
      email,
      Number(phone),
      dob,
      Number(diagnosis_date),
      Number(type_diabetes),
    );
  }
}
