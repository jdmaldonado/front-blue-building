export interface HttpRequest {
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get(request: HttpRequest): Promise<unknown>;
  post(request: HttpRequest): Promise<unknown>;
}

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

export interface FetchHttpClientConfig {
  baseUrl: string;
  getToken?: () => string | null;
}

export function createFetchHttpClient(config: FetchHttpClientConfig): HttpClient {
  async function request(method: string, req: HttpRequest): Promise<unknown> {
    const token = config.getToken?.() ?? null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...req.headers,
    };

    let response: Response;
    try {
      response = await fetch(`${config.baseUrl}${req.path}`, {
        method,
        headers,
        body: req.body === undefined ? undefined : JSON.stringify(req.body),
      });
    } catch (cause) {
      throw new HttpError(null, 'Network request failed', cause);
    }

    const text = await response.text();
    const payload = text.length > 0 ? safeParseJson(text) : null;

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP ${response.status}`, payload);
    }
    return payload;
  }

  return {
    get: (req) => request('GET', req),
    post: (req) => request('POST', req),
  };
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
