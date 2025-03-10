"use client";
import { LANGS, LangFormat } from "@/models/types";

export const langFormat = ({ uz, ru, en }: LangFormat) => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem("lang") as LANGS;

    switch (lang) {
      case LANGS.uz:
        return uz;
      case LANGS.ru:
        return ru;
      case LANGS.en:
        return en;
      default:
        return uz;
    }
  } else {
    return uz;
  }
};
