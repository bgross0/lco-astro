// Base API client for Odoo integration

// Use Odoo API directly - it has CORS enabled for all origins
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
  retries?: number
  retryDelay?: number
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const { params, retries = 3, retryDelay = 1000, ...fetchOptions } = options || {}

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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  }

  // Add API key if configured (for future use)
  const apiKey = process.env.ODOO_API_KEY
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  // Retry logic with exponential backoff
  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url.toString(), {
        ...fetchOptions,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          throw new ApiError(
            data.error || `API Error: ${response.statusText}`,
            response.status,
            data
          )
        }

        // Retry on 5xx errors (server errors)
        if (response.status >= 500) {
          lastError = new ApiError(
            data.error || `Server Error: ${response.statusText}`,
            response.status,
            data
          )

          if (attempt < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
            continue
          }
        }
      }

      return data
    } catch (error) {
      if (error instanceof ApiError && error.status && error.status < 500) {
        throw error // Don't retry client errors
      }

      lastError = error instanceof Error ? error : new Error('An unknown error occurred')

      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
        continue
      }
    }
  }

  // All retries failed
  throw lastError || new ApiError('Request failed after multiple retries')
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