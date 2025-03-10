import mongoose from "mongoose";
import { SALE_FORM, Saled_Product } from "./types";

const saleSchema = new mongoose.Schema<Saled_Product>({
  barcode: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  saledDate: {
    type: Date,
  },
  productId: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String || "",
  },
  cost: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number || 0,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  saledPrice: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    enum: Object.values(SALE_FORM),
    required: true,
  },
});

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);
