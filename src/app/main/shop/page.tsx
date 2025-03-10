import CustomShopsTable from "@/components/shops/CustomTable";
import React from "react";

function Shops() {
  if (typeof window === undefined) return null;
  return <CustomShopsTable />;
}

export default Shops;
