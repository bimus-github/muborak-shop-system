import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Qaytarishlar",
    description:
      "Qaytarishlar: Bu bo'lim yaroqsiz bo'lgan mahsulotlar haqida ma'lumotlarni ko'rishga yordam beradi.",
  };
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
