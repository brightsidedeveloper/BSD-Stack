export interface FetchOptions extends RequestInit {
  queryParams?: Record<string, unknown>
}

const BASE_URL = '' // Set a default base URL if needed.

const buildQueryString = (params: Record<string, unknown> = {}): string => {
  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
  return query ? `?${query}` : ''
}

export const get = async <T = unknown>(
  endpoint: string,
  queryParams: Record<string, unknown> = {},
  options: FetchOptions = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}${buildQueryString(queryParams)}`
  const response = await fetch(url, {
    ...options,
    method: 'GET',
  })
  if (!response.ok) throw new Error(`Error: ${response.statusText}`)
  return response.json() as Promise<T>
}

export const post = async <T = unknown>(endpoint: string, body: unknown, options: FetchOptions = {}): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Error: ${response.statusText}`)
  return response.json() as Promise<T>
}

export const put = async <T = unknown>(endpoint: string, body: unknown, options: FetchOptions = {}): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Error: ${response.statusText}`)
  return response.json() as Promise<T>
}

export const patch = async <T = unknown>(endpoint: string, body: unknown, options: FetchOptions = {}): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Error: ${response.statusText}`)
  return response.json() as Promise<T>
}

export const del = async <T = unknown>(
  endpoint: string,
  queryParams: Record<string, unknown> = {},
  options: FetchOptions = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}${buildQueryString(queryParams)}`
  const response = await fetch(url, {
    ...options,
    method: 'DELETE',
  })
  if (!response.ok) throw new Error(`Error: ${response.statusText}`)
  return response.json() as Promise<T>
}
