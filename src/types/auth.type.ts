export type SignUpData = {
  email: string;
  password: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
};

export type AuthResponse = {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type SignUpResponse = {
  message: string;
  user: User;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type ErrorResponse = {
  error: string;
};
