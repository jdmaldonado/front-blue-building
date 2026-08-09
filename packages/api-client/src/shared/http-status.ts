// The status codes this API actually uses (api/src/errors/errorHandler.ts).
export const HttpStatus = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Unprocessable: 422,
} as const;
export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
