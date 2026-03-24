import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PreBooking } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<PreBooking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPreBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      email,
      orderInterest,
    }: {
      name: string;
      phone: string;
      email: string;
      orderInterest: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitPreBooking(name, phone, email, orderInterest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useClearAllBookings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.clearAllBookings();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
