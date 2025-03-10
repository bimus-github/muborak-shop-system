import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Profil",
    description:
      "Profil: Bu bo'limda profilingiz haqidagi ma'llumotlarni olasiz.",
  };
}
export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
      <div id="modal-root" />
    </>
  );
}
