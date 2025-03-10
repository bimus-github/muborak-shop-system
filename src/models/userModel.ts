import mongoose from "mongoose";
import { LangFormat, USER_ROLE, User as User_Type } from "./types";

const userSchema = new mongoose.Schema<User_Type>({
  username: {
    type: String,
    required: [
      true,
      JSON.stringify({
        en: "Please provide a username",
        uz: "Ismingizni kiriting",
        ru: "Пожалуйста, введите ваше имя",
      } as LangFormat),
    ],
    unique: true,
  },
  email: {
    type: String,
    required: [
      true,
      JSON.stringify({
        en: "Please provide an email",
        uz: "Ismingizni kiriting",
        ru: "Пожалуйста, введите ваше имя",
      }),
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [
      true,
      JSON.stringify({
        en: "Please provide a password",
        uz: "Ismingizni kiriting",
        ru: "Пожалуйста, введите ваше имя",
      }),
    ],
  },
  organizationId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [USER_ROLE.ADMIN, USER_ROLE.SALER],
    required: true,
  },
  isVerfied: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

export default mongoose.models.User ||
  mongoose.model<User_Type>("User", userSchema);
