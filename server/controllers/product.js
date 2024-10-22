import Product from "../models/product.js";

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;

      // Get the uploaded file
      const image = req.file ? req.file.filename : null; // File is available as req.file

      const newProduct = new Product({
        name,
        description,
        price,
        category,
        stock,
        image, // Store image filename
      });

      await newProduct.save();
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      res.status(400).json({ message: "Error creating product", error });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;

      const updatedProduct = await Product.findById(req.params.id);

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      updatedProduct.name = name || updatedProduct.name;
      updatedProduct.description = description || updatedProduct.description;
      updatedProduct.price = price || updatedProduct.price;
      updatedProduct.category = category || updatedProduct.category;
      updatedProduct.stock = stock || updatedProduct.stock;

      // Update the image if a new one is uploaded
      if (req.file) {
        updatedProduct.image = req.file.filename; 
      }

      await updatedProduct.save();
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(400).json({ message: "Error updating product", error });
    }
  },
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products", error });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product", error });
    }
  },

  
  deleteProduct: async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product", error });
    }
  }
};

export default productController;
