export type ApiError = {
  response: AxiosErrorResponse;
};

interface AxiosErrorResponse {
  data: ErrorResponse;
  status: number;
  statusText: string;
  request: any;
}

export type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};
