interface ApiOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: HeadersInit;
}

const callApi = async <T>(options: ApiOptions): Promise<T> => {
  const url = `/api${options.endpoint}`;
  const token = getAuthToken();

  const fetchOptions: RequestInit = {
    method: options.method,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  };

  if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
    if (options.body instanceof FormData) {
      fetchOptions.body = options.body;
    } else {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json'
      };
      fetchOptions.body = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error ${response.status}: ${errorData.message || 'Unknown error'}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      return await response.json() as T;
    } else {
      return (await response.blob()) as unknown as T; // Handle Blob or other content types
    }
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export default callApi;

export const getAuthToken = () => localStorage.getItem('jwt');
export const setAuthToken = (token: string) => localStorage.setItem('jwt', token);
export const removeAuthToken = () => localStorage.removeItem('jwt');
export const isAuthenticated = () => !!getAuthToken();
