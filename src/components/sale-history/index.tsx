"use client";
import { MaterialReactTable } from "material-react-table";
import { useReactColumns } from "./columns";
import { useReactTable } from "./table";

const SaleHistory = () => {
  const columns = useReactColumns();
  const table = useReactTable({ columns });

  if (typeof window === "undefined") return null;
  return <MaterialReactTable table={table} />;
};

export default SaleHistory;
