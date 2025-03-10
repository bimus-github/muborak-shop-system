import { Refund } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetRefunds = () => {
  const queryClient = useQueryClient();
  return useQuery<{ data: Refund[] }>({
    queryKey: ["refunds"],
    queryFn: () => axios.get("/api/main/refund").then((res) => res.data),
    initialData: () => queryClient.getQueryData(["refunds"]),
  });
};

export const useCreateRefunds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Refund[]) =>
      axios.post("/api/main/refund", data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["refunds"] }),
  });
};

export const useDeleteRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/main/refund/${id}`).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["refunds"] }),
  });
};
