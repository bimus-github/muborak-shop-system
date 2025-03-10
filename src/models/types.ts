export type Route = {
  name: string;
  to: string;
  desctiption?: string;
};

export enum LANGS {
  uz = "uz",
  ru = "ru",
  en = "en",
}

export type Product = {
  _id?: string;
  name: string;
  price: number;
  cost: number;
  count: number;
  barcode: string;
  userId: string;
  qrCodes: string[];
  quantityPerBox: number;
  minimumCount?: number;
};

export type LangFormat = {
  uz: string;
  ru: string;
  en: string;
};

export type User = {
  _id?: string;
  username: string;
  email: string;
  password: string;
  role: USER_ROLE;
  organizationId: string;
  isVerfied?: boolean;
  isAdmin?: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
};

export type Organization = {
  _id?: string;
  name: string;
  address: string;
  phone: string;
  isPaid?: boolean;
  messageId?: string;
};

export enum USER_ROLE {
  ADMIN = "admin",
  SALER = "saler",
}

export type Shop = {
  _id?: string;
  name: string;
  phone: string;
  date: Date;
  loan_price: number;
  products: Product[];
  userId: string;
};

export type Saled_Product = Product & {
  quantity: number;
  date: Date;
  saledDate?: Date;
  productId: string;
  saledPrice: number;
  discount: number;
  buyerName: string;
  form: SALE_FORM;
};

export enum SALE_FORM {
  CASH = "1",
  LOAN = "2",
  CARD = "3",
  NONE = "0",
}

export type Room = {
  id: string;
  buyerName: string;
  discount: number;
  saledProducts: Saled_Product[];
  userId: string;
};

export type Buyer = {
  _id?: string;
  name: string;
  info: string;
  userId: string;
  messageId?: string;
};

export type Refund = {
  _id?: string;
  name: string;
  cost: number;
  count: number;
  barcode: string;
  userId: string;
  date: Date;
  shopName?: string;
};

export type Cash = {
  _id?: string;
  value: number;
  date: Date;
  reason: CASH_REASON;
  extraInfo: string;
  userId: string;
};

export enum CASH_REASON {
  TAKE = "Olish",
  PUT = "Qo'shish",
  NONE = "Boshqa",
}
