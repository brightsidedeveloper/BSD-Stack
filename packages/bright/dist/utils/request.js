const BASE_URL = ''; // Set a default base URL if needed.
const buildQueryString = (params = {}) => {
    const query = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
    return query ? `?${query}` : '';
};
export const get = async (endpoint, queryParams = {}, options = {}) => {
    const url = `${BASE_URL}${endpoint}${buildQueryString(queryParams)}`;
    const response = await fetch(url, {
        ...options,
        method: 'GET',
    });
    if (!response.ok)
        throw new Error(`Error: ${response.statusText}`);
    return response.json();
};
export const post = async (endpoint, body, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        throw new Error(`Error: ${response.statusText}`);
    return response.json();
};
export const put = async (endpoint, body, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        throw new Error(`Error: ${response.statusText}`);
    return response.json();
};
export const patch = async (endpoint, body, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        throw new Error(`Error: ${response.statusText}`);
    return response.json();
};
export const del = async (endpoint, queryParams = {}, options = {}) => {
    const url = `${BASE_URL}${endpoint}${buildQueryString(queryParams)}`;
    const response = await fetch(url, {
        ...options,
        method: 'DELETE',
    });
    if (!response.ok)
        throw new Error(`Error: ${response.statusText}`);
    return response.json();
};
