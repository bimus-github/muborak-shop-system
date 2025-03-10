"use client";
import { Route } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import {
  AccountCircle,
  AirlineStops,
  Analytics,
  AssignmentReturn,
  History,
  Money,
  People,
  Shop,
  Storage,
} from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { paths } from "./paths";

interface SideBarRoutes extends Route {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
}

export const isNotAdminSideBarRoutes: SideBarRoutes[] = [
  {
    to: paths.sale,
    name: langFormat({ uz: "Savdo", ru: "Продажи", en: "Sale" }),
    Icon: Money,
  },
  {
    to: paths.profile,
    name: langFormat({ uz: "Profil", ru: "Профиль", en: "Profile" }),
    Icon: AccountCircle,
  },
];

export const sideBarRoutes: SideBarRoutes[] = [
  {
    to: paths.sale,
    name: langFormat({ uz: "Savdo", ru: "Продажи", en: "Sale" }),
    Icon: Money,
  },
  {
    to: paths.saleHistory,
    name: langFormat({ uz: "Savdo Tarixi", ru: "История", en: "Sales" }),
    Icon: History,
  },
  {
    to: paths.storage,
    name: langFormat({ uz: "Ombor", ru: "Склад", en: "Storage" }),
    Icon: Storage,
  },
  {
    to: paths.shop,
    name: langFormat({ uz: "Do'konlar", ru: "Магазины", en: "Shops" }),
    Icon: Shop,
  },
  {
    to: paths.buyer,
    name: langFormat({ uz: "Haridorlar", ru: "Покупатели", en: "Buyers" }),
    Icon: People,
  },
  {
    to: paths.refund,
    name: langFormat({
      uz: "Qaytarilganlar",
      ru: "Возвращенные",
      en: "Refunded",
    }),
    Icon: AssignmentReturn,
  },
  {
    to: paths.cash,
    name: langFormat({
      uz: "Kirim/Chiqim",
      ru: "Приход/Расход",
      en: "Income/Expense",
    }),
    Icon: AirlineStops,
  },
  {
    to: paths.statistics,
    name: langFormat({ uz: "Statistika", ru: "Статистика", en: "Statistics" }),
    Icon: Analytics,
  },
  {
    to: paths.profile,
    name: langFormat({ uz: "Profil", ru: "Профиль", en: "Profile" }),
    Icon: AccountCircle,
  },
];
