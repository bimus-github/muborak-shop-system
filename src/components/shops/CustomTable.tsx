"use client";
import { MaterialReactTable } from "material-react-table";
import React, { useState } from "react";
import { useReactColumns } from "./columns";
import { useReactTable } from "./table";

function CustomShopsTable() {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useReactColumns({ validationErrors, setValidationErrors });
  const table = useReactTable({
    columns,
    setValidationErrors,
  });

  if (typeof window === "undefined") return null;
  return <MaterialReactTable table={table} />;
}

export default CustomShopsTable;
