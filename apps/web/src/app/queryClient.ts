import { ContractError } from '@bb/core';
import { NoopLogger, type Logger } from '@bb/logger';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

// One retry, not the default three. A failing endpoint answered four times in a
// row looks like the app is calling it four times, and it buries the real error.
const RETRY_COUNT = 1;

// A broken contract answers the same however many times we ask.
function shouldRetry(failureCount: number, error: Error): boolean {
  return !(error instanceof ContractError) && failureCount < RETRY_COUNT;
}

// The client is a singleton because `endSession` clears it from outside React,
// but the logger only exists once the config is validated. Until then, silence.
let logger: Logger = new NoopLogger();

export function setQueryLogger(next: Logger): void {
  logger = next;
}

// Without this a failed request only shows as an alert on screen: the gateway
// translates the error and nobody writes it down.
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry } },
  queryCache: new QueryCache({
    onError: (error, query) => {
      logger.error('Query failed', { queryKey: query.queryKey, error });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      logger.error('Mutation failed', { mutationKey: mutation.options.mutationKey, error });
    },
  }),
});
