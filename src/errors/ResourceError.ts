import { HttpStatus } from '@nestjs/common';
import ApiError from './ApiError';

export const UnauthorizedAccessError = () => {
  throw new ApiError(
    HttpStatus.UNAUTHORIZED,
    'Unauthorized',
    'You are trying to access a secured route',
  );
};
