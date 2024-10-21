import { param } from 'express-validator';

export const getPackageCostByPackageIdValidation = [
  param('packageId')
    .notEmpty()
    .withMessage('packageId is required')
    .isMongoId()
    .withMessage('Invalid packageId format'),
];
