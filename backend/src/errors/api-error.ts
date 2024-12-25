import {
  ApiErrorInterface,
  ErrorItemInterface,
} from '@common/interfaces/api-error.interface';

// Use one error class for all places in project
export class ApiError extends Error {
  status: number;

  title: string | undefined;

  errorId: string | undefined;

  code: string;

  errors: ErrorItemInterface[] | [];

  constructor(error: ApiErrorInterface) {
    super(error.message);
    this.title = error.title ?? 'Internal system error';
    this.status = error.status;
    this.code = error.code;
    this.errors = error.errors;
  }
}
