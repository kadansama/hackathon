const BASE_URL = '/api';

export type ApiAnswer<T> = {
  isError: boolean;
  data?: T;
  status?: number;
  errorMessage?: string;
};

export async function customGet<T>(path: string): Promise<ApiAnswer<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      credentials: 'include',
    });

    const status = response.status;

    if (!response.ok) {
      return {
        isError: true,
        status,
      };
    }

    const data = (await response.json()) as T;

    return {
      isError: false,
      status,
      data,
    };
  } catch (err) {
    const error = err as Error;

    return {
      isError: true,
      errorMessage: error.message,
    };
  }
}

export async function customPost<TBody, TResponse>(path: string, data: TBody): Promise<ApiAnswer<TResponse>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const status = response.status;

    if (!response.ok) {
      return {
        isError: true,
        status,
      };
    }

    const responseData = (await response.json()) as TResponse;

    return {
      isError: false,
      status,
      data: responseData,
    };
  } catch (err) {
    const error = err as Error;

    return {
      isError: true,
      errorMessage: error.message,
    };
  }
}
