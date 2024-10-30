import { param } from 'express-validator';

export const getSubCategoryByCategoryIdValidation = [
  param('categoryId')
    .notEmpty()
    .withMessage('categoryId is required')
    .isMongoId()
    .withMessage('Invalid categoryId format'),
  param('type')
    .notEmpty()
    .withMessage('type is required')
    .isIn(['kid', 'parent'])
    .withMessage('type must be either "kid" or "parent"'),
];
