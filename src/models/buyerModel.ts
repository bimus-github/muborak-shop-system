import mongoose from "mongoose";
import { Buyer } from "./types";

export const productSchema = new mongoose.Schema<Buyer>({
  name: {
    type: String,
    required: [
      true,
      JSON.stringify({
        uz: "Ism kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      }),
    ],
    unique: true,
  },
  info: {
    type: String || "",
  },
  userId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    default: "",
  },
});

export default mongoose.models.Buyer ||
  mongoose.model<Buyer>("Buyer", productSchema);
