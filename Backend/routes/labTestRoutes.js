import express from 'express';
import {
  createLabTest,
  getLabTests,
  getLabTest,
  updateLabTest,
  deleteLabTest,
  searchLabTests,
  getLabTestCategories
} from '../controllers/labTestController.js';
import {
  createLabTestValidator,
  updateLabTestValidator,
  getLabTestsValidator,
  searchLabTestsValidator
} from '../validators/labTestValidator.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getLabTestsValidator, getLabTests);
router.get('/search', searchLabTestsValidator, searchLabTests);
router.get('/categories', getLabTestCategories);
router.get('/:id', getLabTest);

// Protected routes (require authentication)
router.use(protect);
router.post('/', createLabTestValidator, createLabTest);
router.put('/:id', updateLabTestValidator, updateLabTest);
router.delete('/:id', deleteLabTest);

export default router;
