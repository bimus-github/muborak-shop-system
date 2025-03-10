"use client";
import { useMemo } from "react";
import { useGetShops } from "../../hooks/shop";
import { langFormat } from "@/utils/langFormat";
import AccordionComponent from "../accordion";
import { FixedSizeList } from "react-window";
import { item, renderRow } from "./renderRow";

const AccordionChild = () => {
  const { data: shopsData } = useGetShops(new Date(1970, 1, 1));

  const count = useMemo(() => shopsData?.shops?.length || 0, [shopsData]);
  const totalProducts = useMemo(
    () =>
      shopsData?.shops?.reduce(
        (a, b) => a + b.products?.reduce((a, b) => a + b.count, 0),
        0
      ) || 0,
    [shopsData]
  );
  const totalLoan = useMemo(
    () => shopsData?.shops?.reduce((a, b) => a + b?.loan_price || 0, 0) || 0,
    [shopsData]
  );
  const totalCommingCost = useMemo(
    () =>
      shopsData?.shops?.reduce(
        (a, b) => a + b.products?.reduce((a, b) => a + b.count * b.cost, 0),
        0
      ) || 0,
    [shopsData]
  );
  const totalSellingCost = useMemo(
    () =>
      shopsData?.shops?.reduce(
        (a, b) => a + b.products?.reduce((a, b) => a + b.count * b.price, 0),
        0
      ) || 0,
    [shopsData]
  );
  const totalProfit = useMemo(
    () =>
      shopsData?.shops?.reduce(
        (a, b) =>
          a +
          b.products?.reduce(
            (a, b) => a + b.count * b.price - b.cost * b.count,
            0
          ),
        0
      ) || 0,
    [shopsData]
  );
  const data = useMemo(
    () => [
      {
        title: item.title({
          uz: "Do'konlar soni",
          en: "Count of shops",
          ru: "Количество магазинов",
        }),
        extra: item.extra({
          uz: "Necha martda mahsulot olib keltirilgani",
          en: "Count of imports",
          ru: "Количество импортов",
        }),
        value:
          count.toLocaleString() +
          " " +
          langFormat({ uz: "ta", en: "", ru: "" }),
      },
      {
        title: item.title({
          uz: "Mahsulotlar soni",
          en: "Count of products",
          ru: "Количество продукции",
        }),
        extra: item.extra({
          uz: "Do'konga keltirilgan mahsulotlar soni",
          en: "Count of imorted products",
          ru: "Количество импортированных продуктов",
        }),
        value:
          totalProducts.toLocaleString() +
          " " +
          langFormat({ uz: "ta", en: "", ru: "" }),
      },
      {
        title: item.title({
          uz: "Qarzlarim",
          en: "My loans",
          ru: "Мои кредиты",
        }),
        extra: item.extra({
          uz: "Mazaginlardan qolgan qarzlar yig'indisi",
          en: "Unpaid loans",
          ru: "Неоплаченные кредиты",
        }),
        value: item.value(totalLoan),
      },
      {
        title: item.title({ uz: "Sarf", en: "Cost", ru: "Стоимость" }),
        extra: item.extra({
          uz: "Olib kelingan mahsulotlar miqdori",
          en: "Cost of imported products",
          ru: "Стоимость импортной продукции",
        }),
        value: item.value(totalCommingCost),
      },
      {
        title: item.title({
          uz: "Taxminiy tushum",
          en: "Estimated income",
          ru: "Предполагаемый доход",
        }),
        extra: item.extra({
          uz: "Taxminiy yig'ilishi kerak bo'lgan pul miqdori",
          en: "Approximate amount of money to be earned",
          ru: "Приблизительная сумма денег, которую можно заработать",
        }),
        value: item.value(totalSellingCost),
      },
      {
        title: item.title({
          uz: "Taxminiy foyda",
          en: "Estimated profit",
          ru: "Предполагаемая прибыль",
        }),
        extra: item.extra({
          uz: "Qilinishi mumkin bo'lgan foyda",
          en: "Approximate profit",
          ru: "Приблизительная прибыль",
        }),
        value: item.value(totalProfit),
      },
    ],
    [
      totalProducts,
      count,
      totalLoan,
      totalCommingCost,
      totalSellingCost,
      totalProfit,
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
};

function ShopReport() {
  return (
    <AccordionComponent
      title={langFormat({
        uz: "Do'konlar hisoboti",
        en: "Shop report",
        ru: "Отчёт о магазинах",
      })}
      describtion={langFormat({
        uz: "Do'konga olib kelingan mahsulotlar haqida hisobot",
        en: "Imported products report",
        ru: "Отчёт о импортированных продуктах",
      })}
    >
      <AccordionChild />
    </AccordionComponent>
  );
}

export default ShopReport;
