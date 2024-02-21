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
    options = {} // guards against crashing spread of potentially undefined options
}: FetchRequestParams) => {
    try {
        const headers = await getHeaders();
        const requestOptions: RequestInit = {
            method,
            headers,
            ...options,
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
    const text = await response.text();
    let data;
    
    // Try to parse JSON only if there is text, otherwise use the response statusText as the data.
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        // If JSON parsing fails, log the error and use the raw text as the data.
        console.error('Error parsing JSON:', error);
        data = text;
      }
    } else {
      data = response.statusText;
    }
  
    if (response.ok) {
      return data;
    } else {
      // When the response is not ok, construct an error object with more context.
      const errorDetail = {
        status: response.status,
        message: data || 'An error occurred' // Fallback to a generic message if data is empty.
      };
    //   throw new Error(JSON.stringify(errorDetail)); // Throwing an error instead of returning an error object.
      return {error: errorDetail};
    }
  };
  

// Publicly exposed methods using makeRequest for actual request handling
export const fetchWrapper = {
    get: async ({ url, options }: { url: string; options?: FetchOptions }) => 

        // fixme - commented out the cache option for now as freshly created auctions were not showing up in the list
        doFetch({ url, method: 'GET', options/*: { ...{ cache: 'force-cache' }, ...options} */}),

    post: async ({ url, body, options }: { url: string; body: BodyType; options?: FetchOptions }) => 
        doFetch({ url, method: 'POST', body, options }),

    put: async ({ url, body, options }: { url: string; body: BodyType; options?: FetchOptions }) => 
        doFetch({ url, method: 'PUT', body, options }),

    del: async ({ url, options }: { url: string; options?: FetchOptions }) => 
        doFetch({ url, method: 'DELETE', options }), 
};
