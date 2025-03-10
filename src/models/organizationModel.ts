import mongoose from "mongoose";
import { Organization } from "./types";

export const productSchema = new mongoose.Schema<Organization>({
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
  address: {
    type: String,
    required: [
      true,
      JSON.stringify({
        uz: "Manzil kiritilishi shart!",
        ru: "Пожалуйста, введите ваш адрес",
        en: "Please enter your address",
      }),
    ],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: [
      true,
      JSON.stringify({
        uz: "Telefon raqam kiritilishi shart!",
        ru: "Пожалуйста, введите ваш телефон",
        en: "Please enter your phone",
      }),
    ],
  },
  messageId: {
    type: String,
    default: "",
  },
});

export default mongoose.models.Organization ||
  mongoose.model<Organization>("Organization", productSchema);
