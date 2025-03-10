"use client";
import { MaterialReactTable } from "material-react-table";
import React, { useState } from "react";
import { useReactColumns } from "./columns";
import { useReactTable } from "./table";
import { Product } from "@/models/types";

function CustomShopTable() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useReactColumns({
    validationErrors,
    setValidationErrors,
    selectedProduct,
    setSelectedProduct,
  });
  const table = useReactTable({
    columns,
    setValidationErrors,
    selectedProduct,
    setSelectedProduct,
  });

  if (typeof window === "undefined") return null;
  return <MaterialReactTable table={table} />;
}

export default CustomShopTable;
