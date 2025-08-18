export enum ErrorCode {
  // Food Categories
  FOOD_CATEGORY_NOT_FOUND = 'FOOD_CATEGORY_NOT_FOUND',
  FOOD_CATEGORY_ALREADY_EXISTS = 'FOOD_CATEGORY_ALREADY_EXISTS',
  FOOD_CATEGORY_NAME_REQUIRED = 'FOOD_CATEGORY_NAME_REQUIRED',
  FOOD_CATEGORY_INVALID_DATA = 'FOOD_CATEGORY_INVALID_DATA',
  
  // Foods
  FOOD_NOT_FOUND = 'FOOD_NOT_FOUND',
  FOOD_ALREADY_EXISTS = 'FOOD_ALREADY_EXISTS',
  
  // Patients
  PATIENT_NOT_FOUND = 'PATIENT_NOT_FOUND',
  PATIENT_ALREADY_EXISTS = 'PATIENT_ALREADY_EXISTS',
  
  // General
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
}

export abstract class DomainError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly httpStatus: number;

  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FoodCategoryNotFoundError extends DomainError {
  readonly code = ErrorCode.FOOD_CATEGORY_NOT_FOUND;
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`Food category with id '${id}' not found`);
  }
}

export class FoodCategoryAlreadyExistsError extends DomainError {
  readonly code = ErrorCode.FOOD_CATEGORY_ALREADY_EXISTS;
  readonly httpStatus = 409;

  constructor(name: string) {
    super(`Food category with name '${name}' already exists`);
  }
}

export class FoodCategoryValidationError extends DomainError {
  readonly code = ErrorCode.FOOD_CATEGORY_INVALID_DATA;
  readonly httpStatus = 400;

  constructor(message: string, details?: any) {
    super(message, details);
  }
}

export class ValidationError extends DomainError {
  readonly code = ErrorCode.VALIDATION_ERROR;
  readonly httpStatus = 400;

  constructor(message: string, details?: any) {
    super(message, details);
  }
}

export class InternalError extends DomainError {
  readonly code = ErrorCode.INTERNAL_ERROR;
  readonly httpStatus = 500;

  constructor(message: string = 'Internal server error', details?: any) {
    super(message, details);
  }
}
