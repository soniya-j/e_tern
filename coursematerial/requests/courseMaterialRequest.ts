import { param, body } from 'express-validator';
import mongoose from 'mongoose';

export const getCourseMaterialBySubCategoryIdValidation = [
  param('subCategoryId')
    .notEmpty()
    .withMessage('subCategoryId is required')
    .isMongoId()
    .withMessage('Invalid subCategoryId format'),
  param('type')
    .notEmpty()
    .withMessage('type is required')
    .isIn(['kid', 'parent'])
    .withMessage('type must be either "kid" or "parent"'),
];

export const trackCourseMaterialValidation = [
  body('courseMaterialId')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isString()
    .withMessage('courseMaterialId must be a number')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid courseMaterialId format');
      }
      return true;
    }),
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isString()
    .withMessage('userId must be a string')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),

  /*
  body('viewedPercentage')
    .notEmpty()
    .withMessage('viewedPercentage is required')
    .isNumber()
    .withMessage('viewedPercentage must be a string'),  
    */
];
