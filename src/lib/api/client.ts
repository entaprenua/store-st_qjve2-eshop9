const API_BASE = '/api/v1';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  csrfToken?: string;
};

let cachedCsrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  cachedCsrfToken = token;
}

export function getCsrfToken(): string | null {
  return cachedCsrfToken;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, csrfToken } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const effectiveCsrf = csrfToken || cachedCsrfToken;
  if (effectiveCsrf && method !== 'GET') {
    requestHeaders['X-CSRF-Token'] = effectiveCsrf;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);

  if (response.status === 401) {
    const event = new CustomEvent('auth:unauthorized');
    window.dispatchEvent(event);
    throw new ApiError('Unauthorized', response.status);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(error.message || `HTTP ${response.status}`, response.status, error);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();

  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    const apiResponse = json as { success: boolean; data: unknown; message?: string; error?: unknown };
    if (apiResponse.success) {
      return apiResponse.data as T;
    } else {
      throw new ApiError(apiResponse.message || 'Request failed', response.status, apiResponse.error);
    }
  }

  return json as T;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = {
  get: <T>(path: string, csrfToken?: string) =>
    request<T>(path, { csrfToken }),
  post: <T>(path: string, body: unknown, csrfToken?: string) =>
    request<T>(path, { method: 'POST', body, csrfToken }),
  put: <T>(path: string, body: unknown, csrfToken?: string) =>
    request<T>(path, { method: 'PUT', body, csrfToken }),
  patch: <T>(path: string, body: unknown, csrfToken?: string) =>
    request<T>(path, { method: 'PATCH', body, csrfToken }),
  delete: <T>(path: string, csrfToken?: string) =>
    request<T>(path, { method: 'DELETE', csrfToken }),
};
