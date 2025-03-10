import SaleHistory from "@/components/sale-history";

const SaleHistoryPage = () => {
  if (typeof window === undefined) return null;
  return <SaleHistory />;
};

export default SaleHistoryPage;
