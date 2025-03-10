import { Room } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetRoom = (roomId: string) => {
  return useQuery<{ room: Room }>({
    queryKey: ["room", roomId],
    refetchOnWindowFocus: false,
    retryDelay: 0,
    initialData: () => {
      return {
        room: {
          id: roomId,
          userId: "",
          saledProducts: [],
          buyerName: "",
          discount: 0,
        },
      };
    },
    enabled: !!roomId,
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Room) => {
      queryClient.setQueryData(["room", data.id], { room: data });
      return {
        success: true,
      };
    },
    networkMode: "always",
  });
};
