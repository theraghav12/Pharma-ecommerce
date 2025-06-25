import LabTest from "../models/LabTest.js";
import { validationResult } from 'express-validator';

/**
 * @desc    Create a new lab test
 * @route   POST /api/lab-tests
 * @access  Private/Admin
 */
export const createLabTest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const labTest = new LabTest({
      ...req.body,
      'metadata.createdBy': req.user.id
    });

    await labTest.save();
    
    res.status(201).json({
      success: true,
      data: labTest
    });
  } catch (error) {
    console.error('Error creating lab test:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lab test',
      error: error.message
    });
  }
};

/**
 * @desc    Get all lab tests
 * @route   GET /api/lab-tests
 * @access  Public
 */
export const getLabTests = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = LabTest.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const total = await LabTest.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(skip).limit(limit);

    // Execute query
    const labTests = await query;

    // Calculate pagination
    const pagination = {};
    
    if (skip + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (skip > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: labTests.length,
      pagination,
      data: labTests
    });
  } catch (error) {
    console.error('Error getting lab tests:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lab tests',
      error: error.message
    });
  }
};

/**
 * @desc    Get single lab test
 * @route   GET /api/lab-tests/:id
 * @access  Public
 */
export const getLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id);
    
    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    res.status(200).json({
      success: true,
      data: labTest
    });
  } catch (error) {
    console.error('Error getting lab test:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lab test',
      error: error.message
    });
  }
};

/**
 * @desc    Update lab test
 * @route   PUT /api/lab-tests/:id
 * @access  Private/Admin
 */
export const updateLabTest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let labTest = await LabTest.findById(req.params.id);
    
    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    // Update fields
    labTest = await LabTest.findByIdAndUpdate(
      req.params.id, 
      { 
        ...req.body,
        'metadata.lastUpdated': Date.now()
      }, 
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: labTest
    });
  } catch (error) {
    console.error('Error updating lab test:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lab test',
      error: error.message
    });
  }
};

/**
 * @desc    Delete lab test
 * @route   DELETE /api/lab-tests/:id
 * @access  Private/Admin
 */
export const deleteLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id);
    
    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    await labTest.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting lab test:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lab test',
      error: error.message
    });
  }
};

/**
 * @desc    Search lab tests
 * @route   GET /api/lab-tests/search
 * @access  Public
 */
export const searchLabTests = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, isHomeCollection } = req.query;
    
    // Build query
    const query = {};
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Price range filter
    const priceQuery = {};
    if (minPrice) priceQuery.$gte = parseFloat(minPrice);
    if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);
    if (Object.keys(priceQuery).length > 0) {
      query.finalPrice = priceQuery;
    }
    
    // Home collection filter
    if (isHomeCollection === 'true') {
      query.isHomeCollectionAvailable = true;
    }
    
    const labTests = await LabTest.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: labTests.length,
      data: labTests
    });
  } catch (error) {
    console.error('Error searching lab tests:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching lab tests',
      error: error.message
    });
  }
};

/**
 * @desc    Get lab test categories
 * @route   GET /api/lab-tests/categories
 * @access  Public
 */
export const getLabTestCategories = async (req, res) => {
  try {
    const categories = await LabTest.distinct('category');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error getting lab test categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lab test categories',
      error: error.message
    });
  }
};
