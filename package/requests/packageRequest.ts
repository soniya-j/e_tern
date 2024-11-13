import { body, param } from 'express-validator';

export const packageCreateValidation = [
  body('packageName')
    .notEmpty()
    .withMessage('packageName is required')
    .isString()
    .withMessage('packageName must be a string'),
  body('ageFrom')
    .notEmpty()
    .withMessage('ageFrom is required')
    .isNumeric()
    .withMessage('ageFrom must be a number'),
  body('ageTo')
    .notEmpty()
    .withMessage('ageTo is required')
    .isNumeric()
    .withMessage('ageTo must be a number'),
];

export const packageUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid package ID format'),
];
