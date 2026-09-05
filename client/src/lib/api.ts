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

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

