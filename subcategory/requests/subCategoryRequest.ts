import { param } from 'express-validator';

export const getSubCategoryByCategoryIdValidation = [
  param('categoryId')
    .notEmpty()
    .withMessage('categoryId is required')
    .isMongoId()
    .withMessage('Invalid categoryId format'),
];
