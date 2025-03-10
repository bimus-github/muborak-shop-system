"use client";
import AccordionComponent from "../accordion";
import dayjs from "dayjs";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Box,
  IconButton,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { SALE_FORM, Saled_Product } from "../../models/types";
import { langFormat } from "@/utils/langFormat";
import { useGetSales } from "@/hooks/sale";
import { FixedSizeList } from "react-window";
import { item, renderRow } from "./renderRow";
import { SsidChartSharp } from "@mui/icons-material";
import {
  LineChart as MuiLineChart,
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts/LineChart";
import { getDaysOfRange } from "@/utils/getDaysOfRange";
import { groupSaledProductsByDays } from "@/utils/groupSaledProductsByDays";
import { MakeOptional } from "@mui/x-date-pickers/internals";

interface statistic {
  count: number;
  totalCommingCost: number;
  totalSellingCost: number;
  totalLoan: number;
  totalProfit: number;
}

const statistic = (saledProducts: Saled_Product[]): statistic => ({
  count: saledProducts?.reduce((a, b) => a + b.quantity, 0) || 0,
  totalCommingCost:
    saledProducts?.reduce((a, b) => a + b.quantity * b.cost, 0) || 0,
  totalSellingCost:
    saledProducts?.reduce(
      (a, b) => a + b.quantity * b.saledPrice * (1 - b.discount / 100),
      0
    ) || 0,
  totalLoan:
    saledProducts
      ?.filter((p) => p.form === SALE_FORM.LOAN)
      ?.reduce(
        (a, b) => a + b.quantity * b.saledPrice * (1 - b.discount / 100),
        0
      ) || 0,
  totalProfit:
    saledProducts?.reduce(
      (a, b) =>
        a + b.quantity * (b.saledPrice * (1 - b.discount / 100) - b.cost),
      0
    ) || 0,
});

const statistics = (data: Saled_Product[][], key: keyof statistic) => {
  return data.map((d) => statistic(d)[key]);
};

const ListReport = ({ saledProducts }: { saledProducts: Saled_Product[] }) => {
  const { count, totalCommingCost, totalLoan, totalProfit, totalSellingCost } =
    useMemo(() => statistic(saledProducts), [saledProducts]);

  const data = useMemo<{ title: string; value: string; extra?: string }[]>(
    () => [
      {
        title: item.title({
          uz: "Sotilgan mahsulotlar soni",
          ru: "Количество проданных продуктов",
          en: "Number of sold products",
        }),
        value: count + " " + langFormat({ uz: "ta", ru: "шт", en: "pcs" }),
      },
      {
        title: item.title({
          uz: "Jami kelish narxi",
          ru: "Общая стоимость прихода",
          en: "Total comming cost",
        }),
        extra: langFormat({
          uz: "Sotilgan mahsulotlarni kelish narxi",
          ru: "Стоимость проданных продуктов",
          en: "Cost of sold products",
        }),
        value: item.value(totalCommingCost),
      },
      {
        title: item.title({
          uz: "Jami sotilish narxi",
          ru: "Общая стоимость продажи",
          en: "Total selling cost",
        }),
        extra: langFormat({
          uz: "Sotilgan mahsulotlarni sotilish narxi",
          ru: "Стоимость проданных продуктов",
          en: "Cost of sold products",
        }),
        value: item.value(totalSellingCost),
      },
      {
        title: item.title({
          uz: "Jami nasiyalar",
          ru: "Общие расходы",
          en: "Total loans",
        }),
        extra: item.extra({
          uz: "Jami nasiya qilinigan savdo",
          en: "Total loaned sale",
          ru: "Общая продажа в задолженности",
        }),
        value: item.value(totalLoan),
      },
      {
        title: item.title({ uz: "Foyda", ru: "Прибыль", en: "Profit" }),
        value: item.value(totalProfit),
      },
    ],
    [count, totalCommingCost, totalLoan, totalProfit, totalSellingCost]
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
};

const LineChart = ({
  saledProducts,
  start,
  end,
}: {
  saledProducts: Saled_Product[];
  start: string;
  end: string;
}) => {
  const days = getDaysOfRange(start, end);
  const groupedData = groupSaledProductsByDays(saledProducts, days);

  const series = useMemo<{ data: number[]; label: string; id: string }[]>(
    () => [
      {
        data: statistics(groupedData, "count"),
        id: "count",
        label: langFormat({ uz: "Soni", ru: "Количество", en: "Count" }),
      },
      {
        data: statistics(groupedData, "totalCommingCost"),
        id: "total-comming",
        label: langFormat({
          uz: "Jami kelish narxi",
          ru: "Общая стоимость прихода",
          en: "Total comming cost",
        }),
      },
      {
        data: statistics(groupedData, "totalSellingCost"),
        id: "total-selling",
        label: langFormat({
          uz: "Jami sotilish narxi",
          ru: "Общая стоимость продажи",
          en: "Total selling cost",
        }),
      },
      {
        data: statistics(groupedData, "totalLoan"),
        id: "total-loan",
        label: langFormat({
          uz: "Jami nasiyalar",
          ru: "Общие расходы",
          en: "Total loans",
        }),
      },
      {
        data: statistics(groupedData, "totalProfit"),
        id: "total-profit",
        label: langFormat({ uz: "Foyda", ru: "Прибыль", en: "Profit" }),
      },
    ],
    [groupedData]
  );

  return (
    <MuiLineChart
      height={400}
      series={series}
      xAxis={[{ scaleType: "point", data: days }]}
      sx={{
        [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
          strokeWidth: 1,
        },
        ".MuiLineElement-series-pvId": {
          strokeDasharray: "5 5",
        },
        ".MuiLineElement-series-uvId": {
          strokeDasharray: "3 4 5 2",
        },
        [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]:
          {
            fill: "#fff",
          },
        [`& .${markElementClasses.highlighted}`]: {
          stroke: "none",
        },
      }}
    />
  );
};

const AccordionChild = () => {
  const { data: salesData } = useGetSales();
  const [isChangingDate, startDateTransition] = useTransition();
  const [saledProducts, setSaledProducts] = useState<Saled_Product[]>([]);

  const [isChart, setIsChart] = useState(false);
  const [start, setStart] = useState<string>(
    dayjs(new Date().valueOf() - 10 * 24 * 60 * 60 * 1000).format("MM/DD/YYYY")
  );
  const [end, setEnd] = useState<string>(
    dayjs(new Date()).format("MM/DD/YYYY")
  );

  useEffect(() => {
    startDateTransition(() => {
      setSaledProducts(
        (salesData?.sales as Saled_Product[])?.filter(
          (p) =>
            dayjs(new Date(p.date)).isAfter(dayjs(start)) &&
            dayjs(new Date(p.date).valueOf()).isBefore(dayjs(end).add(1, "day"))
        )
      );
    });
  }, [end, salesData?.sales, start]);

  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
  const isLoading =
    isChangingDate ||
    start.length !== 10 ||
    end.length !== 10 ||
    !regex.test(start) ||
    !regex.test(end) ||
    !!!saledProducts;
  return (
    <Box component={"div"} width={"100%"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          label={langFormat({
            uz: "oy/kun/yil dan",
            ru: "из месяца/дня/года",
            en: "from month/day/year",
          })}
          value={start}
          onChange={(e) => setStart(e.target.value)}
          size="small"
        />
        <Box
          sx={{ width: "1rem", height: "1px", bgcolor: "text.primary" }}
        ></Box>
        <TextField
          label={langFormat({
            uz: "oy/kun/yil gacha",
            ru: "в месяца/дня/год",
            en: "to month/day/year",
          })}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          size="small"
        />
        <Typography>
          {(new Date(end).valueOf() - new Date(start).valueOf()) /
            (1000 * 60 * 60 * 24)}{" "}
          {langFormat({
            uz: "kun belgilandi",
            en: "date is set",
            ru: "дата установлена",
          })}
        </Typography>
        <Tooltip
          title={
            isChart
              ? langFormat({
                  uz: "Umumiy hisobotga o'tish",
                  en: "Go to total report",
                  ru: "Перейти в общий отчёт",
                })
              : langFormat({
                  uz: "Kunlik hisobotga o'tish",
                  en: "Go to daily report",
                  ru: "Перейти в ежедневный отчёт",
                })
          }
        >
          <IconButton
            onClick={() => setIsChart(!isChart)}
            sx={{
              ml: "auto",
              mr: "1rem",
              bgcolor: isChart ? "divider" : "transparent",
            }}
          >
            <SsidChartSharp />
          </IconButton>
        </Tooltip>
      </Box>
      {isLoading && <LinearProgress sx={{ mx: "auto", my: 5 }} />}
      {!isLoading && (
        <>
          {isChart ? (
            <LineChart start={start} end={end} saledProducts={saledProducts} />
          ) : (
            <ListReport saledProducts={saledProducts} />
          )}
        </>
      )}
    </Box>
  );
};

function SaleReport() {
  return (
    <AccordionComponent
      defaultExpanded
      title={langFormat({
        uz: "Savdo Tarixi",
        en: "Sale History",
        ru: "История продаж",
      })}
      describtion={langFormat({
        uz: "Savdo Tarixining belgilangan oraliqdagi hisoboti",
        en: "Sale History for the selected period",
        ru: "История продаж за выбранный период",
      })}
    >
      <AccordionChild />
    </AccordionComponent>
  );
}

export default SaleReport;
