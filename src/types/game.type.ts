export type GameState = {
  isOver: boolean;
  winner: string | null;
  isDraw: boolean;
  _id: string;
};

export type GameSession = {
  id: string;
  board: string[][];
  currentPlayer: string;
  gameState: GameState;
  isComputerFirst: boolean;
};

export type GameResponse = {
  gameSession: GameSession;
};

export type GameErrorResponse = {
  error: string;
};

export type StartGameRequest = {
  isComputerFirst: boolean;
};

export type MakeMoveRequest = {
  row: number;
  col: number;
}; 