import mongoose from "mongoose";
import { CASH_REASON, Cash } from "./types";

export const productSchema = new mongoose.Schema<Cash>({
  reason: {
    enum: CASH_REASON,
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  extraInfo: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Cash || mongoose.model("Cash", productSchema);
