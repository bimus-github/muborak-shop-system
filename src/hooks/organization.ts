import { Organization, User } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetOrganization = (id: string) =>
  useQuery({
    queryKey: ["organization"],
    queryFn: () =>
      axios.get(`/api/user/organization/${id}`).then((res) => res.data),
    enabled: !!id,
  });

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Organization) =>
      axios.post(`/api/user/organization`, data).then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["organization"] }),
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Organization) =>
      axios.put(`/api/user/organization`, data).then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["organization"] }),
  });
};

export const useGetAllUsersOfOrganization = (id: string) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios.get(`/api/user/organization/users/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: User) => axios.post("/api/user/signup", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
