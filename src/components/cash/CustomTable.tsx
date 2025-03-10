"use client";

import { useState } from "react";
import { useColumns } from "./columns";
import { useTable } from "./table";
import { MaterialReactTable } from "material-react-table";

export const CustomTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const columns = useColumns({ validationErrors, setValidationErrors });
  const table = useTable({ columns, setValidationErrors });

  return <MaterialReactTable table={table} />;
};
