import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const userRegisterValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('fullName is required')
    .isString()
    .withMessage('fullName must be a string'),

  body('mobileNumber')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isNumeric()
    .withMessage('mobileNumber must be a number'),

  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate()
    .withMessage('Invalid date format'),

  body('userType')
    .notEmpty()
    .withMessage('userType is required')
    .isIn(['child', 'teenager', 'adult'])
    .withMessage('Invalid userType'),

  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];

export const verifyOtpValidation = [
  body('mobileNumber')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isNumeric()
    .withMessage('mobileNumber must be a number'),
  body('otp')
    .notEmpty()
    .withMessage('otp is required')
    .isString()
    .withMessage('otp must be a string'),
  body('deviceId')
    .notEmpty()
    .withMessage('deviceId is required')
    .isString()
    .withMessage('deviceId must be a string'),
  body('deviceType')
    .notEmpty()
    .withMessage('deviceType is required')
    .isString()
    .withMessage('deviceType must be a string'),
];

export const sendOtpValidation = [
  body('mobileNumber')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isNumeric()
    .withMessage('mobileNumber must be a number'),
];

export const getProfileValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),
];

export const courseMaterialTrackValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),
];

export const userUpdateValidation = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('Invalid userId format')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId format');
      }
      return true;
    }),

  body('fullName').optional().isString().withMessage('fullName must be a string'),

  body('mobileNumber').optional().isNumeric().withMessage('mobileNumber must be a number'),

  body('dob').optional().isDate().withMessage('Invalid date format'),

  body('userType').optional().isIn(['child', 'teenager', 'adult']).withMessage('Invalid userType'),

  body('email').optional().isEmail().withMessage('Invalid email format'),

  body('parentName').optional().isString().withMessage('parentName must be a string'),

  body('parentDob').optional().isDate().withMessage('Invalid date format for parentDob'),

  body('interest').optional().isString().withMessage('interest must be a string'),
];
