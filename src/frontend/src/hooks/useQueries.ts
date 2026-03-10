import { useQuery } from "@tanstack/react-query";
import type { Mood } from "../backend.d";
import { useActor } from "./useActor";

export function useRandomMood(enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<Mood>({
    queryKey: ["randomMood", enabled],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getRandomMood();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
