"use client";

import React, { useState } from "react";
import { useReactColumns } from "./columns";
import { useReactTable } from "./table";
import { MaterialReactTable } from "material-react-table";

function CustomTable() {
  const [validationErrors, setValidationErrors] = useState({});
  const columns = useReactColumns({ validationErrors, setValidationErrors });
  const table = useReactTable({ columns, setValidationErrors });

  return <MaterialReactTable table={table} />;
}

export default CustomTable;
