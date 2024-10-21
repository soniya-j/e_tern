import { body } from 'express-validator';

export const userRegisterValidation = [
  body('userName')
    .notEmpty()
    .withMessage('userName is required')
    .isString()
    .withMessage('userName must be a string'),

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

  //body('parentName').optional().isString().withMessage('parentName must be a string'),

  //body('parentDob').optional().isDate().withMessage('Invalid date format for parentDob'),

  //body('interest').optional().isString().withMessage('interest must be a string'),
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
