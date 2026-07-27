import type { LogContext, LogLevel, Logger } from './types';

export class ConsoleLogger implements Logger {
  constructor(private readonly context: LogContext = {}) {}

  debug(message: string, context?: LogContext): void {
    this.write('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write('error', message, context);
  }

  child(context: LogContext): Logger {
    return new ConsoleLogger({ ...this.context, ...context });
  }

  private write(level: LogLevel, message: string, context?: LogContext): void {
    const payload = { ...this.context, ...context };
    const line = `[${level}] ${message}`;
    if (level === 'error') {
      console.error(line, payload);
    } else if (level === 'warn') {
      console.warn(line, payload);
    } else {
      console.log(line, payload);
    }
  }
}
