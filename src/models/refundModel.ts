import mongoose from "mongoose";
import { Refund } from "./types";

const refund = new mongoose.Schema<Refund>({
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
  },
  cost: {
    type: Number,
    required: [
      true,
      JSON.stringify({
        uz: "Narx kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      }),
    ],
  },
  count: {
    type: Number,
    required: [
      true,
      JSON.stringify({
        uz: "Soni kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      }),
    ],
  },
  barcode: {
    type: String,
    required: [
      true,
      JSON.stringify({
        uz: "Kod kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      }),
    ],
  },
  userId: {
    type: String,
    required: [
      true,
      JSON.stringify({
        uz: "Ism kiritilishi shart!",
        ru: "Пожалуйста, введите ваше имя",
        en: "Please enter your name",
      }),
    ],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  shopName: {
    type: String,
  },
});

export default mongoose.models.Refund || mongoose.model("Refund", refund);
