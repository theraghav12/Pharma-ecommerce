import mongoose from "mongoose";

const testParameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String },
  referenceRange: { type: String },
  description: { type: String }
}, { _id: false });

const labTestSchema = new mongoose.Schema({
  testName: { 
    type: String, 
    required: true,
    trim: true
  },
  testCode: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Blood Tests',
      'Imaging',
      'Pathology',
      'Cardiology',
      'Neurology',
      'Endocrinology',
      'Microbiology',
      'Genetics',
      'Other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  preparation: {
    type: String,
    required: true
  },
  reportTime: {
    type: String, // e.g., "24-48 hours"
    required: true
  },
  parameters: [testParameterSchema],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountedPrice: {
    type: Number,
    default: function() {
      return this.price * (1 - (this.discount / 100));
    }
  },
  isHomeCollectionAvailable: {
    type: Boolean,
    default: true
  },
  homeCollectionPrice: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  includedTests: [{
    type: String
  }],
  excludedTests: [{
    type: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'temporarily_unavailable'],
    default: 'active'
  },
  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for final price after discount
labTestSchema.virtual('finalPrice').get(function() {
  return this.discount > 0 
    ? Math.round(this.price * (1 - (this.discount / 100)) * 100) / 100 
    : this.price;
});

// Pre-save hook to update discountedPrice
labTestSchema.pre('save', function(next) {
  this.discountedPrice = this.finalPrice;
  next();
});

// Text index for search
labTestSchema.index({
  testName: 'text',
  description: 'text',
  'parameters.name': 'text'
});

const LabTest = mongoose.model('LabTest', labTestSchema);

export default LabTest;
