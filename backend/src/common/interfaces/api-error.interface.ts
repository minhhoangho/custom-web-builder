export interface ErrorOptionInterface {
  title?: string;
  message?: string;
  errors?: ErrorItemInterface[] | [];
}

export interface ApiErrorInterface extends ErrorOptionInterface {
  status: number;
  code: string;
  options?: ErrorOptionInterface;
}

export interface ErrorItemInterface {
  title?: string;
  field: string;
  message: string;
  context?: any;
}
