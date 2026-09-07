export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  statusCode: number;
  raw?: any;

  constructor(statusCode: number, message: string, raw?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.raw = raw;
  }
}

export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  let url: string;
  if (envUrl) {
    url = envUrl;
  } else if (import.meta.env.DEV) {
    url = 'http://localhost:5000/api';
  } else {
    // Production default (Railway deployment)
    url = 'https://chowly.up.railway.app/api';
  }

  // Prepend protocol if omitted (e.g. "chowly.up.railway.app" or "localhost:5000")
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
    url = `${isLocal ? 'http://' : 'https://'}${url}`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Append /api if not already part of the path (unless it is a root relative path '/')
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    url = `${url}/api`;
  }

  return url;
}

export const BASE_URL = getApiBaseUrl();
if (import.meta.env.DEV) {
  console.log(`[API] Base URL (${import.meta.env.MODE}):`, BASE_URL);
}
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers, 
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const body: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      message: res.statusText || 'An unexpected error occurred',
      data: null as any,
    }));

    if (!res.ok || body.success === false) {
      throw new ApiError(
        res.status,
        body.message || `Request failed with status ${res.status}`,
        body
      );
    }

    return body.data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || 'Network connection error');
  }
}

export const api = {
  get: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: any, headers?: HeadersInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  patch: <T>(endpoint: string, body?: any, headers?: HeadersInit) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  delete: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};

