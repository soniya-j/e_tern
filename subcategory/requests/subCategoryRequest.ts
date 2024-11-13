import { param, body } from 'express-validator';

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

export const subCategoryCreateValidation = [
  body('subCategoryName')
    .notEmpty()
    .withMessage('subCategoryName is required')
    .isString()
    .withMessage('subCategoryName must be a string'),
  body('categoryId')
    .notEmpty()
    .withMessage('categoryId is required')
    .isMongoId()
    .withMessage('Invalid categoryId format'),
  body('imageUrl')
    .notEmpty()
    .withMessage('imageUrl is required')
    .isString()
    .withMessage('imageUrl must be a string'),
  body('sorting')
    .notEmpty()
    .withMessage('sorting is required')
    .isNumeric()
    .withMessage('sorting must be a number'),
  body('type')
    .notEmpty()
    .withMessage('type is required')
    .isIn(['kid', 'parent'])
    .withMessage('type must be either "kid" or "parent"'),
];

export const subCategoryUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid subCategory ID format'),
];
