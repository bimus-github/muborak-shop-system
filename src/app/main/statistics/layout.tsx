import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistika",
    description:
      "Statistika: Bu bo'lim sizga tashkilot analitikasi haqida ma'lumotlarni ko'rishga yordam beradi.",
  };
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
