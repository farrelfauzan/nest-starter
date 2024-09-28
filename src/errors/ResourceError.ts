import { HttpStatus } from '@nestjs/common';
import ApiError from './ApiError';

export const UnauthorizedAccessError = () => {
  throw new ApiError(
    HttpStatus.UNAUTHORIZED,
    'Unauthorized',
    'You are trying to access a secured route',
  );
};

export const EmployeeAlreadyExistError = (key) => {
  throw new ApiError(
    HttpStatus.NOT_FOUND,
    'Employee already exist',
    `Employee with this ${key} is already exist`,
  );
};

export const UserNotFoundError = () => {
  throw new ApiError(
    HttpStatus.NOT_FOUND,
    'User not found',
    'User with this id is not found',
  );
};
