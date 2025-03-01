import { param, body } from 'express-validator';

export const subscriptionValidation = [
  body('studentId')
    .notEmpty()
    .withMessage('studentId is required')
    .isMongoId()
    .withMessage('Invalid studentId format'),
  body('packageId')
    .notEmpty()
    .withMessage('packageId is required')
    .isMongoId()
    .withMessage('Invalid packageId format'),
  body('packageCostId')
    .notEmpty()
    .withMessage('packageCostId is required')
    .isMongoId()
    .withMessage('Invalid packageCostId format'),
  body('paymentRef')
    .notEmpty()
    .withMessage('paymentRef is required')
    .isString()
    .withMessage('paymentRef must be a string'),
  body('paymentGateway')
    .notEmpty()
    .withMessage('paymentGateway is required')
    .isString()
    .withMessage('paymentGateway must be a string'),
  body('comment').isString().withMessage('comment must be a string'),
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isString()
    .withMessage('status must be a string'),
  body('deviceId')
    .notEmpty()
    .withMessage('deviceId is required')
    .isString()
    .withMessage('deviceId must be a string'),
  body('userIP')
    .notEmpty()
    .withMessage('userIP is required')
    .isString()
    .withMessage('userIP must be a string'),
];

export const offlinePaymentValidation = [
  body('studentId')
    .notEmpty()
    .withMessage('studentId is required')
    .isMongoId()
    .withMessage('Invalid studentId format'),

  body('packageId')
    .notEmpty()
    .withMessage('packageId is required')
    .isMongoId()
    .withMessage('Invalid packageId format'),
  body('packageCostId')
    .notEmpty()
    .withMessage('packageCostId is required')
    .isMongoId()
    .withMessage('Invalid packageCostId format'),
  body('paymentRef')
    .notEmpty()
    .withMessage('paymentRef is required')
    .isString()
    .withMessage('paymentRef must be a string'),
  /*
  body('paymentDate')
    .notEmpty()
    .withMessage('paymentDate is required')
    .isDate()
    .withMessage('paymentDate must be a date'),
  */
  body('paymentDate')
    .notEmpty()
    .withMessage('paymentDate is required')
    .custom((value) => {
      return !isNaN(Date.parse(value));
    })
    .withMessage('paymentDate must be a valid date'),

  body('comment').isString().withMessage('comment must be a string'),
  body('amount')
    .notEmpty()
    .withMessage('amount is required')
    .isNumeric()
    .withMessage('amount must be a number'),
];

export const subscriptionIdValidation = [
  param('id').notEmpty().isMongoId().withMessage('Invalid ID format'),
];
