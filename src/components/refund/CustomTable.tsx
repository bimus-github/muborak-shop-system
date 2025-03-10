"use client";
import React from "react";
import { useReactCoulmns } from "./columns";
import { useReactTable } from "./table";
import { MaterialReactTable } from "material-react-table";

function CustomTable() {
  const columns = useReactCoulmns();
  const table = useReactTable({ columns });

  return <MaterialReactTable table={table} />;
}

export default CustomTable;
