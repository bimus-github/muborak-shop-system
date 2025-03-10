import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ombor",
    description:
      "Ombor: Do'konda mavjud mahsulotlar ro'yxati va holati bo'yicha to'la ma'lumotlarini beradi.",
  };
}
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
