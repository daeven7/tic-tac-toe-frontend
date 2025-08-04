import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  dashboardService,
  GameStatsResponse,
} from "../services/dashboard-service";
import { QUERY_KEYS } from "../utils/constants.utils";

export const useGetData = (
  enabled: boolean = true,
  staleTime: number = 0
): UseQueryResult<GameStatsResponse, unknown> => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_DATA],
    queryFn: () => dashboardService.getUserStats(),
    enabled,
    staleTime,
  });
};
