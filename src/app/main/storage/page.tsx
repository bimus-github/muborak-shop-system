"use client";

import StorageTable from "@/components/storage/CustomTable";

export default function Storage() {
  if (typeof window === undefined) return null;
  return <StorageTable />;
}
