import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String, 
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
