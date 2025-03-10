"use client";
import { langFormat } from "@/utils/langFormat";
import { useMemo } from "react";
import AccordionComponent from "../accordion";
import { FixedSizeList } from "react-window";
import { item, renderRow } from "./renderRow";
import { useGetProducts } from "@/hooks/product";

function AccordionChild() {
  const { data: productsData } = useGetProducts();

  const count = useMemo(
    () => productsData?.products?.length || 0,
    [productsData?.products]
  );
  const countOfProducts = useMemo(
    () => productsData?.products?.reduce((a, b) => a + b.count, 0) || 0,
    [productsData?.products]
  );
  const totalCommingCost = useMemo(
    () =>
      productsData?.products?.reduce((a, b) => a + b.count * b.cost, 0) || 0,
    [productsData?.products]
  );
  const totalSellingCost = useMemo(
    () =>
      productsData?.products?.reduce((a, b) => a + b.count * b.price, 0) || 0,
    [productsData?.products]
  );
  const totalProfit = useMemo(
    () =>
      productsData?.products?.reduce(
        (a, b) => a + b.count * (b.price - b.cost),
        0
      ) || 0,
    [productsData?.products]
  );

  const data = useMemo(
    () => [
      {
        title: item.title({
          uz: "Mahsulotlar turi",
          en: "Product type",
          ru: "Тип продукции",
        }),
        extra: item.extra({
          uz: "Xar-xil nomli mahsulotlar soni",
          ru: "Количество товаров с разными названиями",
          en: "Number of products with different names",
        }),
        value: count + " " + langFormat({ uz: "ta", en: "", ru: "" }),
      },
      {
        title: item.title({
          uz: "Mahsulotlar soni",
          en: "Product count",
          ru: "Количество продукции",
        }),
        extra: item.extra({
          uz: "Barcha mahsulotlar soni",
          ru: "Количество всех продукции",
          en: "Total product count",
        }),
        value: countOfProducts + " " + langFormat({ uz: "ta", en: "", ru: "" }),
      },
      {
        title: item.title({
          en: "Cost of all products",
          uz: "Barcha mahsulotlarning narxi",
          ru: "Стоимость всех продукции",
        }),
        extra: item.extra({
          uz: "Umumiy kelish narxi",
          ru: "Всего приход",
          en: "Total comming cost",
        }),
        value: item.value(totalCommingCost),
      },
      {
        title: item.title({
          en: "Price of all products",
          uz: "Umumiy sotilish narxi",
          ru: "Общая цена продажи",
        }),
        extra: item.extra({
          uz: "Umumiy sotish narxi",
          ru: "Всего продаж",
          en: "Total selling cost",
        }),
        value: item.value(totalSellingCost),
      },
      {
        title: item.title({
          en: "Estimated profit",
          uz: "Tahminiy foyda",
          ru: "Ожидаемая прибыль",
        }),
        extra: item.extra({
          uz: "Qo'yilgan narxda sotisa kutulgan foyda",
          ru: "Прибыль при продаже",
          en: "Profit after selling",
        }),
        value: item.value(totalProfit),
      },
    ],
    [count, countOfProducts, totalCommingCost, totalSellingCost, totalProfit]
  );

  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemSize={100}
      itemCount={data.length}
      itemData={data}
    >
      {renderRow}
    </FixedSizeList>
  );
}

function StorageReport() {
  return (
    <AccordionComponent
      title={langFormat({ uz: "Ombor", en: "Storage", ru: "Склад" })}
      describtion={langFormat({
        uz: "Ombor hisobori",
        en: "Storage report",
        ru: "Отчёт о складе",
      })}
    >
      <AccordionChild />
    </AccordionComponent>
  );
}

export default StorageReport;
