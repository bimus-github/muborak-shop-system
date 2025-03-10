import SideBar from "@/components/sidebar";
import axios from "axios";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  console.log(params);

  //   try {
  //     const res = await fetch(`${process.env.DOMAIN}/api/shop/product`, {
  //       method: "POST",
  //       body: JSON.stringify({ userId: params.id }),
  //     }).then((res) => res.json());

  //     console.log(res);
  //   } catch (error: any) {
  //     console.log(error);
  //   }

  return {
    title: "Do'kon",
    description:
      "Do'kon: Do'konga keltirilgan mahsulotlarni qanchadan, qachon, qanchaga ... olib kelingan, barcha ma'lomotlarini beradi.",
  };
}
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
