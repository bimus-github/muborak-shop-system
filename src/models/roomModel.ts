import mongoose from "mongoose";
import { Room, SALE_FORM, Saled_Product } from "./types";

const subSaledProductsSchema = new mongoose.Schema<Saled_Product>({
  barcode: {
    type: String,
  },
  buyerName: {
    type: String,
  },
  cost: {
    type: Number || 0,
  },
  count: {
    type: Number || 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: Number || 0,
  },
  name: {
    type: String || "",
  },
  price: {
    type: Number || 0,
  },
  productId: {
    type: String || "",
  },
  quantity: {
    type: Number || 0,
  },
  saledPrice: {
    type: Number || 0,
  },
  form: {
    type: String,
    enum: Object.values(SALE_FORM),
    default: SALE_FORM.NONE,
  },
  userId: {
    type: String,
    required: true,
  },
});

export const RoomSchema = new mongoose.Schema<Room>({
  id: {
    type: String,
  },
  buyerName: {
    type: String,
  },
  discount: {
    type: Number,
  },
  saledProducts: {
    type: [subSaledProductsSchema],
    default: [],
  },
  userId: {
    type: String,
  },
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
