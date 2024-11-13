import { param, body } from 'express-validator';

export const getCategoryByPackageIdValidation = [
  param('studentId')
    .notEmpty()
    .withMessage('studentId is required')
    .isMongoId()
    .withMessage('Invalid studentId format'),
  param('type')
    .notEmpty()
    .withMessage('type is required')
    .isIn(['kid', 'parent'])
    .withMessage('type must be either "kid" or "parent"'),
];

export const categoryCreateValidation = [
  body('categoryName')
    .notEmpty()
    .withMessage('categoryName is required')
    .isString()
    .withMessage('categoryName must be a string'),
  body('packageId')
    .notEmpty()
    .withMessage('packageId is required')
    .isMongoId()
    .withMessage('Invalid packageId format'),
  body('imageUrl')
    .notEmpty()
    .withMessage('imageUrl is required')
    .isString()
    .withMessage('imageUrl must be a string'),
  body('categoryName')
    .notEmpty()
    .withMessage('categoryName is required')
    .isString()
    .withMessage('categoryName must be a string'),
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

export const categoryUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid category ID format'),
];
