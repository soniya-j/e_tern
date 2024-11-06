import { param, body } from 'express-validator';
import mongoose from 'mongoose';

export const getStudentsByUserIdValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format'),
];

export const studentAddValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('fullName is required')
    .isString()
    .withMessage('fullName must be a string'),
  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate()
    .withMessage('Invalid date format'),
  body('gender')
    .notEmpty()
    .withMessage('gender is required')
    .isIn(['male', 'female'])
    .withMessage('Invalid gender'),
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format'),
];

export const studentUpdateValidation = [
  param('studentId')
    .notEmpty()
    .withMessage('studentId is required')
    .isMongoId()
    .withMessage('Invalid studentId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid studentId format');
      }
      return true;
    }),
  body('fullName')
    .notEmpty()
    .withMessage('fullName is required')
    .isString()
    .withMessage('fullName must be a string'),
  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate()
    .withMessage('Invalid date format'),
  body('gender')
    .notEmpty()
    .withMessage('gender is required')
    .isIn(['male', 'female'])
    .withMessage('Invalid gender'),
];
