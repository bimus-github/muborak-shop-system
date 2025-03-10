"use client";
import { useState } from "react";
import { Box, Divider } from "@mui/material";
import React from "react";
import SearchSide from "@/components/sale/SearchSide";
import Pagination from "@/components/pagination";
import SaledProductsList from "@/components/sale/SaledProductsList";

function Sale() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 0.01fr 1fr",
        height: "80vh",
        overflowX: "auto",
        width: "100%",
      }}
    >
      <SearchSide roomId={currentPage} />
      <Divider orientation="vertical" flexItem />
      <SaledProductsList roomId={currentPage} />
      <Pagination setCurrentPage={setCurrentPage} page={currentPage} />
    </Box>
  );
}

export default Sale;
