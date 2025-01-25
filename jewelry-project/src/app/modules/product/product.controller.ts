import { Request, Response } from 'express';
import Product from './product.model';


export const createProduct = async (req: Request, res: Response): Promise<void> => {
    console.log('Reached createProduct controller'); // Log to confirm execution
    try {
      const {
        name,
        details,
        inventory,
        category,
        size,
        thickness,
        color,
        minOrderQuantity,
        price
      } = req.body;
  
      const createdBy = req.user?.id;
  
      if (!name || !details || !inventory || !category || !size || !thickness || !color || !minOrderQuantity || !price || !createdBy) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }
  
      const product = new Product({
        name,
        details,
        inventory,
        category,
        size,
        thickness,
        color,
        minOrderQuantity,
        price,
        createdBy,
      });
  
      const savedProduct = await product.save();
  
      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct,
      });
    } catch (error: any) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, minPrice, maxPrice, color } = req.query;
  
      // Build query object dynamically
      const query: any = {};
  
      if (category) query.category = category;
      if (color) query.color = color;
      if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) }; // Greater than or equal to minPrice
      if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) }; // Less than or equal to maxPrice
  
      // Fetch products based on the query
      const products = await Product.find(query);
  
      res.status(200).json({
        message: 'Products retrieved successfully',
        products,
      });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };