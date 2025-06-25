import { body, param, query } from 'express-validator';

export const createLabTestValidator = [
  body('testName')
    .trim()
    .notEmpty()
    .withMessage('Test name is required')
    .isLength({ max: 200 })
    .withMessage('Test name must be less than 200 characters'),
    
  body('testCode')
    .trim()
    .notEmpty()
    .withMessage('Test code is required')
    .isUppercase()
    .withMessage('Test code must be uppercase')
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Test code can only contain letters, numbers, hyphens, and underscores'),
    
  body('category')
    .isIn([
      'Blood Tests',
      'Imaging',
      'Pathology',
      'Cardiology',
      'Neurology',
      'Endocrinology',
      'Microbiology',
      'Genetics',
      'Other'
    ])
    .withMessage('Invalid test category'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
    
  body('preparation')
    .trim()
    .notEmpty()
    .withMessage('Preparation instructions are required'),
    
  body('reportTime')
    .trim()
    .notEmpty()
    .withMessage('Report time is required'),
    
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('discount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
    
  body('parameters')
    .optional()
    .isArray()
    .withMessage('Parameters must be an array'),
    
  body('parameters.*.name')
    .if(body('parameters').isArray())
    .trim()
    .notEmpty()
    .withMessage('Parameter name is required'),
    
  body('isHomeCollectionAvailable')
    .optional()
    .isBoolean()
    .withMessage('Home collection availability must be a boolean'),
    
  body('homeCollectionPrice')
    .if(body('isHomeCollectionAvailable').equals(true))
    .isFloat({ min: 0 })
    .withMessage('Home collection price must be a positive number'),
    
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'temporarily_unavailable'])
    .withMessage('Invalid status')
];

export const updateLabTestValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lab test ID'),
    
  body('testName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Test name cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Test name must be less than 200 characters'),
    
  body('testCode')
    .optional()
    .trim()
    .isUppercase()
    .withMessage('Test code must be uppercase')
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Test code can only contain letters, numbers, hyphens, and underscores'),
    
  body('category')
    .optional()
    .isIn([
      'Blood Tests',
      'Imaging',
      'Pathology',
      'Cardiology',
      'Neurology',
      'Endocrinology',
      'Microbiology',
      'Genetics',
      'Other'
    ])
    .withMessage('Invalid test category'),
    
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
    
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'temporarily_unavailable'])
    .withMessage('Invalid status')
];

export const getLabTestsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string'),
    
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
    
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
    
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
    
  query('isHomeCollection')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isHomeCollection must be either true or false')
];

export const searchLabTestsValidator = [
  query('q')
    .optional()
    .isString()
    .withMessage('Search query must be a string'),
    
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
    
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
    
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
    
  query('isHomeCollection')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isHomeCollection must be either true or false')
];
