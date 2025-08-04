import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { gameService } from "../services/game-service";
import { GameResponse } from "../types/game.type";
import { QUERY_KEYS } from "../utils/constants.utils";

export const useGetCurrentGame = (
  enabled: boolean = true,
  staleTime: number = 0
): UseQueryResult<GameResponse, unknown> => {
  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_GAME],
    queryFn: () => gameService.getCurrentGame(),
    enabled,
    staleTime,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("No active game session")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}; 