"use client";
import {
  OverallReport,
  SaleReport,
  ShopReport,
  StorageReport,
} from "@/components/report";
import { Box } from "@mui/material";

function Report(): JSX.Element {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
      <OverallReport />
      <StorageReport />
      <SaleReport />
      <ShopReport />
    </Box>
  );
}

export default Report;
