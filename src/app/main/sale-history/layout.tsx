import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Savdo Tarixi",
    description:
      "Savdo bo'limi: Qilingan savdo bo'yicha malumotlarni ko'rishga yordam beradi.",
  };
}
export default function SaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
