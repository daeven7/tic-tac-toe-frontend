export const CONSTANTS = {
  SIGN_UP_PAGE: "/signup",
  SIGN_IN_PAGE: "/",
  APP_PAGE: "/app",
  GAME_STATS_PAGE: "/game-stats",
  TIC_TAC_TOE_PAGE: "/tic-tac-toe",
  LOGOUT_ROUTE: "/auth/logout",
  ACCESS_TOKEN_NAME: "accessToken",
  REFRESH_TOKEN_NAME: "refreshToken",
};

export const ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  LOGOUT: "/auth/logout",
  SIGN_IN: "/auth/login",
  SIGN_UP: "/auth/register",
  GET_DASHBOARD_DATA: "/dashboard/data",
  REFRESH_TOKEN: "/auth/refresh",
};

export const QUERY_KEYS = {
  DASHBOARD_DATA: "DASHBOARD_DATA",
  CURRENT_GAME: "CURRENT_GAME",
};

export const MESSAGES = {
  SIGN_UP_ERROR_MESSAGE: "An error occurred during Sign Up",
  SIGN_IN_ERROR_MESSAGE: "An error occurred during Sign In",
  LOGOUT_ERROR_MESSAGE: "An error occurred during Logout",
  REFRESH_TOKEN_ERROR_MESSAGE: "An error occurred during token refresh",
};
