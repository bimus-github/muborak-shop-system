// import SideBar from "@/components/sidebar";
import { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";

const SideBar = dynamic(() => import("@/components/sidebar"), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Asosiy sahifa",
    description: "Asosiy sahifa",
  };
}
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SideBar>{children}</SideBar>;
}
