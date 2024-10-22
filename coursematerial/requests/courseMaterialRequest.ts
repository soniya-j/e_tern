import { param, body } from 'express-validator';

export const getCourseMaterialBySubCategoryIdValidation = [
  param('subCategoryId')
    .notEmpty()
    .withMessage('subCategoryId is required')
    .isMongoId()
    .withMessage('Invalid subCategoryId format'),
];

export const trackCourseMaterialValidation = [
  body('courseMaterialId')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isString()
    .withMessage('courseMaterialId must be a number'),
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isString()
    .withMessage('userId must be a string'),
  /*
  body('viewedPercentage')
    .notEmpty()
    .withMessage('viewedPercentage is required')
    .isNumber()
    .withMessage('viewedPercentage must be a string'),  
    */
];
