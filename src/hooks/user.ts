import { User } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useGetCurrentUser = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["user"],
    queryFn: () => axios.get("/api/user/current-user").then((res) => res.data),
    refetchOnWindowFocus: false,
    initialData: () => queryClient.getQueryData(["user"]),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axios.post("/api/user/logout").then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      axios
        .get(`/api/user/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if (data.success) {
            return data.user as User;
          } else {
            toast.error(data.message);
            return null;
          }
        }),
    enabled: !!id,
  });
};

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: User) =>
      axios
        .put(`/api/user/${data._id}`, data)
        .then((res) => res.data)
        .then((data) => {
          if (data.success) {
            toast.success(langFormat(data.message));
            return data.user as User;
          } else {
            toast.error(langFormat(data.message));
            return null;
          }
        }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axios
        .delete(`/api/user/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if (data.success) {
            toast.success(langFormat(data.message));
            return data.user as User;
          } else {
            toast.error(langFormat(data.message));
            return null;
          }
        }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
