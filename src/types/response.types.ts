export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
