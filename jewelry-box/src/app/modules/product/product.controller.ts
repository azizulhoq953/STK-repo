// ProductController.controller.ts 
import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";

export const ProductController = {
  create: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
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
 
  findById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;

      const product = await ProductService.findById(productId);

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
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
 
  search: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const keyword = req.query.keyword as string;
  
      if (!keyword || typeof keyword !== "string") {
        res.status(400).json({ message: "Please provide a valid search keyword." });
        return;
      }
  
      const products = await ProductService.search(keyword);
  
      if (!products.length) {
        res.status(404).json({ message: "No products found." });
        return;
      }
  
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
  

};
