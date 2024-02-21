import { getTokenWorkaround } from "../actions/AuthActions";

const BASE_URL = 'http://localhost:6001/';

export type BodyType = {
    [key: string]: unknown;
}

// Enhancing request options typing to explicitly include 'cache' as a standard option
export type FetchOptions = Omit<RequestInit, 'method' | 'body'> & {
    cache?: RequestCache;
};

// Define a new type for doFetch options to include all possible parameters
type FetchRequestParams = {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: BodyType;
    options?: FetchOptions; // Additional fetch options like cache settings
};

const doFetch = async ({
    url,
    method,
    body,
    options = { cache: 'force-cache' }, // Provide default fetch options here
}: FetchRequestParams) => {
    try {
        const headers = await getHeaders();
        const requestOptions: RequestInit = {
            method,
            headers,
            ...options, // Apply fetch options, including default cache setting
            ...(body && { body: JSON.stringify(body) }), // Conditionally include body if provided
        };
        const response = await fetch(`${BASE_URL}${url}`, requestOptions);
        return handleResponse(response);
    } catch (error) {
        console.error('Network error or fetch-related error:', error);
        throw new Error('Network request failed');
    }
};

const getHeaders = async (): Promise<HeadersInit> => {
    try {
        const token = await getTokenWorkaround();
        const headers: HeadersInit = new Headers({
            'Content-Type': 'application/json',
        });
        if (token) {
            headers.append('Authorization', `Bearer ${token.access_token}`);
        }
        return headers;
    } catch (error) {
        console.error('Failed to get token:', error);
        throw new Error('Failed to retrieve authentication token');
    }
};


const handleResponse = async (response: Response) => {
    try {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {            
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }

        return data;
    } catch (error) {        
        console.error('Error parsing JSON:', error);
        throw new Error('Error parsing server response');
    }
};

// Publicly exposed methods using makeRequest for actual request handling
export const fetchWrapper = {
    get: async ({ url, options }: { url: string; options?: FetchOptions }) => 
        doFetch({ url, method: 'GET', options }),

    post: async ({ url, body, options }: { url: string; body: BodyType; options?: FetchOptions }) => 
        doFetch({ url, method: 'POST', body, options }),

    put: async ({ url, body, options }: { url: string; body: BodyType; options?: FetchOptions }) => 
        doFetch({ url, method: 'PUT', body, options }),
        
    del: async ({ url, options }: { url: string; options?: FetchOptions }) => 
        doFetch({ url, method: 'DELETE', options }), 
};
