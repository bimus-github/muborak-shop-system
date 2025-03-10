"use client";

import React from "react";
import { useGetShops } from "../../hooks/shop";
import { useMemo } from "react";
import { langFormat } from "@/utils/langFormat";
import { useGetCashs } from "@/hooks/cash";
import { useGetSales } from "@/hooks/sale";
import { useGetRefunds } from "@/hooks/refund";
import { useGetProducts } from "@/hooks/product";
import {
  CASH_REASON,
  Cash,
  Refund,
  SALE_FORM,
  Saled_Product,
} from "@/models/types";
import AccordionComponent from "../accordion";
import { FixedSizeList } from "react-window";
import { item, renderRow } from "./renderRow";

function AccordionChild() {
  const { data: shopsData } = useGetShops(new Date(1970, 1, 1));
  const { data: cashs } = useGetCashs();
  const { data: salesData } = useGetSales();
  const { data: refundsData } = useGetRefunds();
  const { data: productsInStorageData } = useGetProducts();

  const putCashs = useMemo(
    () =>
      (cashs?.data as Cash[])
        ?.filter((m: Cash) => m.reason === CASH_REASON.PUT)
        ?.reduce((a, b) => a + b.value, 0) || 0,
    [cashs]
  );
  const takenCashs = useMemo(
    () =>
      (cashs?.data as Cash[])
        ?.filter((m) => m.reason === CASH_REASON.TAKE)
        ?.reduce((a, b) => a + b.value, 0) || 0,
    [cashs]
  );
  const myLoans = useMemo(
    () => shopsData?.shops?.reduce((a, b) => a + b?.loan_price || 0, 0) || 0,
    [shopsData]
  );
  const recived = useMemo(
    () =>
      shopsData?.shops?.reduce(
        (a, b) => a + b?.products.reduce((x, y) => x + y.count * y.cost, 0),
        0
      ) || 0,
    [shopsData]
  );
  const earned = useMemo(
    () =>
      (salesData?.sales as Saled_Product[])?.reduce(
        (a, b) => a + b.quantity * b.saledPrice * (1 - b.discount / 100),
        0
      ) || 0,
    [salesData?.sales]
  );
  const refunded = useMemo(
    () =>
      (refundsData?.data as Refund[])?.reduce(
        (a, b) => a + b.count * b.cost,
        0
      ) || 0,
    [refundsData]
  );
  const loans = useMemo(
    () =>
      (salesData?.sales as Saled_Product[])
        ?.filter((p) => p.form === SALE_FORM.LOAN)
        ?.reduce(
          (a, b) => a + b.quantity * b.saledPrice * (1 - b.discount / 100),
          0
        ) || 0,
    [salesData]
  );
  const storage = useMemo(
    () =>
      productsInStorageData?.products?.reduce(
        (a, b) => a + b.count * b.cost,
        0
      ) || 0,
    [productsInStorageData]
  );
  const profit = useMemo(
    () =>
      (salesData?.sales as Saled_Product[])?.reduce(
        (a, b) =>
          a + b.quantity * (b.saledPrice * (1 - b.discount / 100) - b.cost),
        0
      ) || 0,
    [salesData?.sales]
  );

  const data = useMemo(
    () => [
      {
        title: item.title({ uz: "Do'kon", ru: "Склад", en: "Shop" }),
        extra: item.extra({
          uz: "Do'kondagi mahsulotlarning umumiy kelish narxi",
          en: "Total product cost",
          ru: "Общая стоимость продуктов",
        }),
        value: item.value(storage || 0),
      },
      {
        title: item.title({ uz: "Tikilgan", ru: "Выдан", en: "Put" }),
        extra: item.extra({
          uz: "Do'konga qo'shilgan pul miqdori",
          ru: "Приход средств",
          en: "Put cash",
        }),
        value: item.value(putCashs || 0),
      },
      {
        title: item.title({ uz: "Sarflangan", ru: "Списан", en: "Taken" }),
        extra: item.extra({
          uz: "Do'kondan olingan pul miqdori",
          en: "Cash that was taken",
          ru: "Списано средств",
        }),
        value: item.value(takenCashs || 0),
      },
      {
        title: item.title({ uz: "Qarzlarim", ru: "Задолжности", en: "Loans" }),
        extra: item.extra({
          uz: "Mening jami do'konlardan qarzlarim",
          en: "My loans",
          ru: "Мои задолжности",
        }),
        value: item.value(myLoans || 0),
      },
      {
        title: item.title({ uz: "Umumiy", ru: "Всего", en: "Total" }),
        extra: item.extra({
          uz: "Umumiy pul miqdori: Tikilgan - Sarflangan + Qarzlarim + Foyda",
          en: "Total cash: Put - Taken + Loans + Profit",
          ru: "Всего средств: Выдано - Списано + Задолжности + Прибыль",
        }),
        value: item.value(putCashs - takenCashs + myLoans + profit),
      },
      {
        title: item.title({ uz: "Foyda", ru: "Прибыль", en: "Profit" }),
        extra: "",
        value: item.value(profit),
      },
      {
        title: item.title({ uz: "Kassa", ru: "Касса", en: "Shop" }),
        extra: item.extra({
          uz: "Savdo qilingan pul miqdori",
          en: "Saled cash",
          ru: "Выручка средств",
        }),
        value: item.value(
          putCashs + earned - takenCashs - loans + myLoans - recived + refunded
        ),
      },
    ],
    [
      putCashs,
      takenCashs,
      myLoans,
      storage,
      refunded,
      earned,
      profit,
      loans,
      recived,
    ]
  );
  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemSize={100}
      itemCount={data.length}
      itemData={data}
    >
      {renderRow}
    </FixedSizeList>
  );
}
function OverallReport(): JSX.Element {
  return (
    <AccordionComponent
      title={langFormat({
        uz: "Hisobot",
        en: "Report",
        ru: "Отчёт",
      })}
      describtion={langFormat({
        uz: "Do'kon ochilgandan hozirgacha bo'lgan qisqacha hisobot.",
        en: "A brief overview of the shop from the beginning up until now.",
        ru: "Обзор магазина с начала до сегодняшнего дня.",
      })}
    >
      <AccordionChild />
    </AccordionComponent>
  );
}

export default OverallReport;
