const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));

    throw new Error(
      errorBody?.error ||
        errorBody?.message ||
        "Não foi possível processar a requisição.",
    );
  }

  if (response.status === 204) {
    return null as T; // No content, return null
  }

  return response.json() as Promise<T>;
}
