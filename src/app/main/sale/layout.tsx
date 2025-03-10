import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Savdo",
    description:
      "Savdo bo'limi: Omborda mavjud masulotlarni sotishga yordam beradi.",
    openGraph: {
      images: ["/sale.png"],
    },
  };
}
export default function SaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
