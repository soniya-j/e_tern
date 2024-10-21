import { param } from 'express-validator';

export const getCategoryByPackageIdValidation = [
  param('packageId')
    .notEmpty()
    .withMessage('packageId is required')
    .isMongoId()
    .withMessage('Invalid packageId format'),
];
