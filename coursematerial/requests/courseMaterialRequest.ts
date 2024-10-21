import { param } from 'express-validator';

export const getCourseMaterialBySubCategoryIdValidation = [
  param('subCategoryId')
    .notEmpty()
    .withMessage('subCategoryId is required')
    .isMongoId()
    .withMessage('Invalid subCategoryId format'),
];
