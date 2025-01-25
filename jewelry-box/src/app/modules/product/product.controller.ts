import { Request, Response } from "express";
import { ProductService } from "./product.service";

export const ProductController = {
  create: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      // Cast error to `Error` type to access `message`
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  },

  

findById: async (req: Request, res: Response) => {
    const { id } = req.params; // Extract product ID from the URL
    try {
      const product = await ProductService.findById(id); // Call the service to fetch the product
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);  // Return the product if found
    } catch (error) {
      // Type-check the error to access `message` property
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });  // Handle internal server errors
    }
  },

  findAll: async (req: Request, res: Response) => {
    try {
      const products = await ProductService.findAll();
      res.status(200).json(products);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  },


  update: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.update(req.params.id, req.body);
      res.status(200).json(product);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await ProductService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  },
};
