import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler';
import errorHandler  from '../middleware/errorHandler.js';


// @desc    Create a new product
// @route   POST /api/products
// @access  Public (you might need to adjust this based on your authentication requirements)
export const createProduct = asyncHandler ( async (req, res) => {
  try {
    const { name, image, category, description, price, quantity } = req.body;

    // Basic validation
    if (!name || !image || !category || !description || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      image,
      category,
      description,
      price,
      quantity,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with the newly created product
    res.status(201).json(newProduct);
  } catch (error) {
    throw new Error('Internal server error');
    
  }
});


// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
  
    const skip = pageSize * (page - 1);
    const count = await Product.countDocuments({ name: { $regex: keyword, $options: 'i' } });
    const products = await Product.find({ name: { $regex: keyword, $options: 'i' } })
      .limit(pageSize)
      .skip(skip);
  
    const result = {
      products,
      page,
      pages: Math.ceil(count / pageSize),
    };
  
    res.json(result);
  });



// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
export const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const { name, image, category, description, price, quantity } = req.body;
  
    try {
      // Check if the product exists
      const existingProduct = await Product.findById(productId);
  
      if (!existingProduct) {
        throw new Error('Product not found');
      }
  
      // Update the product fields
      existingProduct.name = name || existingProduct.name;
      existingProduct.image = image || existingProduct.image;
      existingProduct.category = category || existingProduct.category;
      existingProduct.description = description || existingProduct.description;
      existingProduct.price = price !== undefined ? price : existingProduct.price;
      existingProduct.quantity = quantity !== undefined ? quantity : existingProduct.quantity;
  
      // Save the updated product
      await existingProduct.save();
  
      res.json(existingProduct);
    } catch (error) {
     throw new Error('Internal server error');
      
    }
  });


// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id;
  
    try {
      // Find the product by ID
      const product = await Product.findById(productId);
  
      if (!product) {
        throw new Error('Product not found');
      }
  
      res.json(product);
    } catch (error) {
    throw new Error('Internal server error');
    }
  });



// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
  
    try {
      // Check if the product exists
      const existingProduct = await Product.findById(productId);
  
      if (!existingProduct) {
        throw new Error('Product not found');
      }
  
      // Remove the product from the database
      await Product.deleteOne({ _id: productId });
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
    throw new Error('Internal server error');
    }
  });