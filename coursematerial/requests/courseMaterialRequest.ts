import { param, body } from 'express-validator';
import mongoose from 'mongoose';

export const getCourseMaterialBySubCategoryIdValidation = [
  param('subCategoryId')
    .notEmpty()
    .withMessage('subCategoryId is required')
    .isMongoId()
    .withMessage('Invalid subCategoryId format'),
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

export const trackCourseMaterialValidation = [
  body('courseMaterialId')
    .notEmpty()
    .withMessage('courseMaterialId is required')
    .isString()
    .withMessage('courseMaterialId must be a number')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid courseMaterialId format');
      }
      return true;
    }),
  body('studentId')
    .notEmpty()
    .withMessage('studentId is required')
    .isString()
    .withMessage('studentId must be a string')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid studentId format');
      }
      return true;
    }),

  /*
  body('viewedPercentage')
    .notEmpty()
    .withMessage('viewedPercentage is required')
    .isNumber()
    .withMessage('viewedPercentage must be a number'),  
    */
];

export const courseMaterialCreateValidation = [
  body('courseMaterialName')
    .notEmpty()
    .withMessage('courseMaterialName is required')
    .isString()
    .withMessage('courseMaterialName must be a string'),
  body('subCategoryId')
    .notEmpty()
    .withMessage('subCategoryId is required')
    .isMongoId()
    .withMessage('Invalid subCategoryId format'),
  body('courseMaterialUrl')
    .notEmpty()
    .withMessage('courseMaterialUrl is required')
    .isString()
    .withMessage('courseMaterialUrl must be a string'),
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

export const courseMaterialUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid courseMaterial ID format'),
];

export const courseMaterialWatchHistoryValidation = [
  body('courseMaterialId')
    .notEmpty()
    .withMessage('courseMaterialId is required')
    .isString()
    .withMessage('courseMaterialId must be a string')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid courseMaterialId format');
      }
      return true;
    }),
  body('studentId')
    .notEmpty()
    .withMessage('studentId is required')
    .isString()
    .withMessage('studentId must be a string')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid studentId format');
      }
      return true;
    }),
    body('categoryId')
    .notEmpty()
    .withMessage('categoryId is required')
    .isString()
    .withMessage('categoryId must be string')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid categoryId format');
      }
      return true;
    }),
  body('subCategoryId')
    .notEmpty()
    .withMessage('subCategoryId is required')
    .isString()
    .withMessage('subCategoryId must be a string')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid subCategoryId format');
      }
      return true;
    }),
  body('watchedDuration')
    .notEmpty()
    .withMessage('watchedDuration is required')
    .isNumeric()
    .withMessage('watchedDuration must be a number'),  
];
