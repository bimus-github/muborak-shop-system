import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Kirim/Chiqim",
    description:
      "Kirim/Chiqim bo'limi: Do'konga tikilgan va olingan pullar haqidagi ma'lumotlar mavjud.",
  };
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
