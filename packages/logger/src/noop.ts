import type { Logger } from './types';

export class NoopLogger implements Logger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
  child(): Logger {
    return this;
  }
}
