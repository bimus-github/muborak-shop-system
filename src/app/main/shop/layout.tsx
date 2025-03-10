import SideBar from "@/components/sidebar";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Do'konlar",
    description:
      "Do'konlar: Do'konga keltirilgan mahsulotlarni qayerdan, qanday, qachon, qanchaga ... barcha ma'lomotlarini beradi.",
  };
}
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
