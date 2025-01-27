// import mongoose, { Schema, Document } from "mongoose";
// import { Product } from "../modules/product/product.types";

// interface IProduct extends Product, Document {}

// const ProductSchema: Schema = new Schema(
//   {
//     name: { type: String, required: true },
//     details: { type: String, required: true },
//     inventory: { type: Number, required: true },
//     category: {
//       type: String,
//       required: true,
//       enum: [
//         "Jewelry Box",
//         "Leather Box",
//         "Cardboard Box",
//         "Paper Box",
//         "Paper Bag",
//       ],
//     },
//     size: { type: String, required: true },
//     thickness: { type: String, required: true },
//     color: { type: String, required: true },
//     minOrderQuantity: { type: Number, required: true },
//     price: { type: Number, required: true },
//     gstPercentage: { type: Number, required: true },
//     images: { type: [String], required: true }, // Array of image URLs
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

// export default ProductModel;


import mongoose, { Schema, Document } from "mongoose";
import { Product } from "../modules/product/product.types"; // Correct import for Product type

// Interface extending the Product type and Document (for Mongoose)
interface IProduct extends Product, Document {}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true },
    inventory: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Jewelry Box",
        "Leather Box",
        "Cardboard Box",
        "Paper Box",
        "Paper Bag",
      ],
    },
    size: { type: String, required: true },
    thickness: { type: String, required: true },
    color: { type: String, required: true },
    minOrderQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    gstPercentage: { type: Number, required: true },
    images: { type: [String], required: true }, // Array of image URLs
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel; // Export the model as default
