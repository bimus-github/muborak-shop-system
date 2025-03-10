import mongoose from "mongoose";
import { LangFormat, Product, Shop } from "./types";

const subSchema = new mongoose.Schema<Product>({
  barcode: {
    type: String,
    required: false,
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
    required: [
      true,
      JSON.stringify({
        uz: "user_id kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      }),
    ],
    unique: false,
  },
});

const shopSchema = new mongoose.Schema<Shop>({
  name: {
    type: String || "",
    required: [
      true,
      JSON.stringify({
        uz: "Ism kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      }),
    ],
    unique: false,
  },
  phone: {
    type: String || "",
    default: "",
    unique: false,
  },
  date: {
    type: Date,
    default: Date.now,
    unique: false,
  },
  loan_price: {
    type: Number || 0,
    default: 0,
    unique: false,
  },
  userId: {
    type: String,
    required: true,
    unique: false,
  },
  products: {
    type: [subSchema],
    default: [],
    unique: false,
  },
});

export default mongoose.models.Shop || mongoose.model<Shop>("Shop", shopSchema);
