import { HttpStatus } from '@nestjs/common';

const DEFAULT_API_ERROR_TITLE = 'Internal Server Error.';
const DEFAULT_API_ERROR_MESSAGE =
  'Something is not working in the back-end. Please contact back-end team to resolve this issue.';

export default class ApiError extends Error {
  private _title: string;
  private _statusCode: number;

  constructor(statusCode: number, title: string, message?: string) {
    super(message || DEFAULT_API_ERROR_MESSAGE);
    this._title = title || DEFAULT_API_ERROR_TITLE;
    this._statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get title(): string {
    return this._title;
  }
}
