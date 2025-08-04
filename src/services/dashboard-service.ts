import api from "../config/axiosConfig";

export type GameStatsResponse = {
  stats: {
    wins: number;
    losses: number;
    draws: number;
    _id: string;
  };
};


export const dashboardService = {
  getUserStats: async (): Promise<GameStatsResponse> => {
    const { data } = await api.get("/game/stats");
    return data;
  },
};

