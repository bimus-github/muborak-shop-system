import { Buyer } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetBuyers = () => {
  const queryClient = useQueryClient();
  return useQuery<{ buyers: Buyer[] }>({
    queryKey: ["buyers"],
    queryFn: () => axios.get("/api/main/buyer").then((res) => res.data),
    initialData: () => queryClient.getQueryData(["buyers"]),
  });
};

export const useCreateBuyer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Buyer) =>
      axios.post("/api/main/buyer", data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buyers"] }),
  });
};

export const useUpdateBuyer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Buyer) =>
      axios.put("/api/main/buyer", data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buyers"] }),
  });
};

export const useDeleteBuyer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete("/api/main/buyer/" + id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buyers"] }),
  });
};
