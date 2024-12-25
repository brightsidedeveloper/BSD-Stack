export interface FetchOptions extends RequestInit {
    queryParams?: Record<string, unknown>;
}
export declare const get: <T = unknown>(endpoint: string, queryParams?: Record<string, unknown>, options?: FetchOptions) => Promise<T>;
export declare const post: <T = unknown>(endpoint: string, body: unknown, options?: FetchOptions) => Promise<T>;
export declare const put: <T = unknown>(endpoint: string, body: unknown, options?: FetchOptions) => Promise<T>;
export declare const patch: <T = unknown>(endpoint: string, body: unknown, options?: FetchOptions) => Promise<T>;
export declare const del: <T = unknown>(endpoint: string, queryParams?: Record<string, unknown>, options?: FetchOptions) => Promise<T>;
