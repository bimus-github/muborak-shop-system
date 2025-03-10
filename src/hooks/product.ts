import { Product } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetProducts = () => {
  const queryClient = useQueryClient();
  return useQuery<{ products: Product[] }>({
    queryKey: ["products"],
    queryFn: () => axios.get("/api/main/product").then((res) => res.data),
    initialData: () => queryClient.getQueryData(["products"]),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Product) => axios.post("/api/main/product", data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: true });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Product) => axios.put("/api/main/product", data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: true });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string }) =>
      axios.delete(`/api/main/product`, { data }),
  });
};
