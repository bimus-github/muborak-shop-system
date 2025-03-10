"use client";
import CustomShopTable from "@/components/shop/CustomShopTable";
import React from "react";

function Shop() {
  if (typeof window === undefined) return null;
  return <CustomShopTable />;
}

export default Shop;
