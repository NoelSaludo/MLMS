import 'server-only';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { revalidate, tags, headers, ...rest } = options;
  const url = `${BACKEND_URL}${path}`;

  const fetchOptions: RequestInit = {
    ...rest,
    headers: {
      ...headers,
    },
  };

  // Automatically set Content-Type to JSON if body is not FormData
  if (!(rest.body instanceof FormData)) {
    fetchOptions.headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };
  }

  // Support native Next.js caching configurations
  if (revalidate !== undefined || tags !== undefined) {
    fetchOptions.next = {
      ...(revalidate !== undefined && { revalidate }),
      ...(tags !== undefined && { tags }),
    };
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`API Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),

  postMultipart: <T>(path: string, body: FormData, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
