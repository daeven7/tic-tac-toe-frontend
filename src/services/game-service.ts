import api from "../config/axiosConfig";
import { 
  GameResponse, 
} from "../types/game.type";

export const gameService = {
  startGame: async (isComputerFirst: boolean) => {
    try {
      const { data } = await api.post<GameResponse>("/game/start", {
        isComputerFirst,
      });
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to start game"
      );
    }
  },

  getCurrentGame: async () => {
    try {
      const { data } = await api.get<GameResponse>("/game/current");
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to get current game"
      );
    }
  },

  makeMove: async (row: number, col: number) => {
    try {
      const { data } = await api.post<GameResponse>("/game/move", {
        row,
        col,
      });
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Invalid move"
      );
    }
  },
}; 