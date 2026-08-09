import { HttpStatus } from '../shared';
import { HttpError } from './http.errors';

export interface HttpRequest {
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get(request: HttpRequest): Promise<unknown>;
  post(request: HttpRequest): Promise<unknown>;
  put(request: HttpRequest): Promise<unknown>;
  delete(request: HttpRequest): Promise<unknown>;
}

export interface FetchHttpClientConfig {
  baseUrl: string;
  getToken?: () => string | null;
  // Called when the API rejects a request that carried a token: the token is
  // dead (or the user is not allowed here) and the session has to be dropped.
  onUnauthorized?: () => void;
}

export function createFetchHttpClient(config: FetchHttpClientConfig): HttpClient {
  async function request(method: string, req: HttpRequest): Promise<unknown> {
    const token = config.getToken?.() ?? null;
    // A multipart body sets its own content type, boundary included. Writing it
    // by hand leaves the boundary out and the server cannot read the parts.
    const multipart = req.body instanceof FormData ? req.body : null;
    const headers: Record<string, string> = {
      ...(multipart === null ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...req.headers,
    };

    let response: Response;
    try {
      response = await fetch(`${config.baseUrl}${req.path}`, {
        method,
        headers,
        body: multipart ?? (req.body === undefined ? undefined : JSON.stringify(req.body)),
      });
    } catch (cause) {
      throw new HttpError(null, 'Network request failed', cause);
    }

    const text = await response.text();
    const payload = text.length > 0 ? safeParseJson(text) : null;

    if (!response.ok) {
      // Only when we sent a token: the login endpoint also answers 401 for bad
      // credentials, and there is no session to close there.
      if (response.status === HttpStatus.Unauthorized && token !== null) {
        config.onUnauthorized?.();
      }
      throw new HttpError(response.status, `HTTP ${response.status}`, payload);
    }
    return payload;
  }

  return {
    get: (req) => request('GET', req),
    post: (req) => request('POST', req),
    put: (req) => request('PUT', req),
    delete: (req) => request('DELETE', req),
  };
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
