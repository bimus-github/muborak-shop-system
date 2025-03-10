import { Cash } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetCashs = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["cashs"],
    queryFn: () => axios.get("/api/main/cash").then((res) => res.data),
    initialData: () => queryClient.getQueryData(["cashs"]),
  });
};

export const useCreateCash = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cash) =>
      axios.post("/api/main/cash", data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cashs"] }),
  });
};

export const useUpdateCash = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cash) =>
      axios.put("/api/main/cash", data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cashs"] }),
  });
};

export const useDeleteCash = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/main/cash/${id}`).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cashs"] }),
  });
};
