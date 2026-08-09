export class HttpError extends Error {
  constructor(
    readonly status: number | null,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
