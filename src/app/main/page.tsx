"use client";

import { useRouter } from "next/navigation";
import { paths } from "@/constants/paths";
import { useLayoutEffect } from "react";

export default function Main() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push(paths.sale);
  }, [router]);

  if (typeof window === undefined) return null;
  return (
    <>
      Go to <a href={paths.sale}>Sale</a>
    </>
  );
}
