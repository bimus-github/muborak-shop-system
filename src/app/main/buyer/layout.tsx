import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Haridorlar",
    description:
      "Haridorlar: Bu bo'limda saqlangan mijozlar bo'yicha ma'lumotlar olasiz.",
  };
}
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
