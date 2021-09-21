import { ApiError } from './api-error';

export class ApiResponse<T> {
  data: T;
  error: ApiError;
}
