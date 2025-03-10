"use client";
import React from "react";
import {
  Box,
  Chip,
  Pagination as MuiPagination,
  PaginationItem,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

function Pagination({
  setCurrentPage,
  page,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}) {
  return (
    <Box sx={{ position: "absolute", bottom: 10, right: 20, display: "flex" }}>
      <MuiPagination
        count={10}
        variant="outlined"
        shape="rounded"
        onChange={(_, page) => setCurrentPage(page)}
        size="large"
        page={page}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBack, next: ArrowForward }}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "#fff",
              },
            }}
            {...item}
          />
        )}
      />
    </Box>
  );
}

export default Pagination;
