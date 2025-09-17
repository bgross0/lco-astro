// Base API client for Odoo integration

const API_BASE_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'https://lco.axsys.app'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const { params, ...fetchOptions } = options || {}

  // Build URL with query params
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  // Add API key if configured
  const apiKey = process.env.ODOO_API_KEY
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.error || `API Error: ${response.statusText}`,
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or parsing errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    )
  }
}

// Helper for GET requests
export const apiGet = <T>(endpoint: string, params?: Record<string, any>) =>
  apiClient<T>(endpoint, { method: 'GET', params })

// Helper for POST requests
export const apiPost = <T>(endpoint: string, body?: any) =>
  apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })

// Helper for PUT requests
export const apiPut = <T>(endpoint: string, body?: any) =>
  apiClient<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })

// Helper for DELETE requests
export const apiDelete = <T>(endpoint: string) =>
  apiClient<T>(endpoint, { method: 'DELETE' })