import {
  deleteSale,
  getSales,
  getSalesFromDate,
  saveSale,
  updateSale,
} from "@/actions/sale";
import { Saled_Product } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetSales = () => {
  const clientQuery = useQueryClient();
  return useQuery({
    queryKey: ["sales"],
    queryFn: () =>
      getSales().then((res) => ({
        sales: JSON.parse(res?.sales || "") as Saled_Product[],
      })),
    initialData: () => clientQuery.getQueryData(["sales"]),
  });
};

export const useGetSalesFromDate = (from: Date) => {
  const clientQuery = useQueryClient();
  return useQuery({
    queryKey: ["sales-from-date"],
    queryFn: () =>
      getSalesFromDate(from).then((res) => ({
        sales: JSON.parse(res?.sales || "") as Saled_Product[],
      })),
    initialData: () => clientQuery.getQueryData(["sales-from-date"]),
    enabled: !!from,
  });
};

export const useCreateSales = () => {
  const clientQuery = useQueryClient();
  return useMutation({
    mutationFn: (data: Saled_Product[]) => saveSale(data),
    onSuccess: (res) => {
      if (res?.success) {
        clientQuery.invalidateQueries({ queryKey: ["sales"] });
      }
      clientQuery.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateSale = () => {
  const clientQuery = useQueryClient();
  return useMutation({
    mutationFn: async (data: { sale: Saled_Product; index: number }) => {
      const res = await updateSale(data.sale);

      return {
        ...res,
        sale: JSON.parse(res?.sale || "") as Saled_Product,
        index: data.index,
      };
    },
    onSuccess: ({ index, sale, success }) => {
      if (success) {
        clientQuery.invalidateQueries({ queryKey: ["sales"] });
        clientQuery.setQueryData<{ sales: Saled_Product[] }>(
          ["sales-from-date"],
          (data) => {
            const newData = [...(data?.sales || [])];
            newData[index] = sale;
            return { sales: newData };
          }
        );
      }
    },
  });
};

export const useDeleteSale = () => {
  const clientQuery = useQueryClient();
  return useMutation({
    mutationFn: (data: { sale: Saled_Product; index: number }) =>
      deleteSale(data.sale).then((res) => ({ ...res, index: data.index })),
    onSuccess: ({ index, success }) => {
      if (success) {
        clientQuery.invalidateQueries({ queryKey: ["sales"] });
        clientQuery.setQueryData<{ sales: Saled_Product[] }>(
          ["sales-from-date"],
          (data) => {
            const newData = [...(data?.sales || [])];
            newData.splice(index, 1);
            return { sales: newData };
          }
        );
      }
    },
  });
};
