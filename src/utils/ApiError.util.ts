class ApiError extends Error {
  statusCode: number;
  errorMessage: string;
  constructor(statusCode: number, errorMessage: string) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}

export { ApiError };
