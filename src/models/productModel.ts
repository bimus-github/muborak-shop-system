import mongoose from "mongoose";
import { LangFormat, Product } from "./types";

export const productSchema = new mongoose.Schema<Product>({
  barcode: {
    type: String,
    required: false,
    unique: true,
  },
  name: {
    type: String,
    required: [
      true,
      JSON.stringify({
        uz: "Ism kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      } as LangFormat),
    ],
    unique: true,
  },
  count: {
    type: Number || 0,
  },
  price: {
    type: Number || 0,
  },
  cost: {
    type: Number || 0,
  },
  userId: {
    type: String,
    required: true,
    unique: false,
  },
  qrCodes: {
    type: [String],
    default: [],
  },
  quantityPerBox: {
    type: Number,
    default: 1,
    required: true,
  },
  minimumCount: {
    type: Number,
  },
});

export default mongoose.models.Product ||
  mongoose.model<Product>("Product", productSchema);
