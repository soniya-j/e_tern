import { param } from 'express-validator';

export const getStudentsByUserIdValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format'),
];
