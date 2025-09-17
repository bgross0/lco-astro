interface ApiOptions {
  method?: string
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

interface Equipment {
  id: number
  name: string
  category: string
  description: string
  hourly_rate: number
  daily_rate: number
  weekly_rate: number
  deposit_amount: number
  available: boolean
  image_url?: string
  specifications?: Record<string, string>
}

interface BookingData {
  equipment_id: number
  start_date: string
  end_date: string
  rental_type: 'hourly' | 'daily' | 'weekly'
  customer_name: string
  customer_email: string
  customer_phone: string
  notes?: string
}

class EquipmentApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    if (options.body) {
      config.body = JSON.stringify(options.body)
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Equipment endpoints
  async getEquipment(filters?: Record<string, string | number | boolean | undefined>) {
    const queryParams = filters ? `?${new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value)
        return acc
      }, {} as Record<string, string>)
    )}` : ''
    return this.request<{ success: boolean; data: Equipment[] }>(`/api/equipment${queryParams}`)
  }

  async getEquipmentById(id: string) {
    return this.request<{ success: boolean; data: Equipment }>(`/api/equipment/${id}`)
  }

  async checkAvailability(equipmentId: number, startDate: string, endDate: string) {
    return this.request<{ available: boolean; estimated_price: number }>('/api/equipment/availability', {
      method: 'POST',
      body: { equipment_id: equipmentId, date_from: startDate, date_to: endDate }
    })
  }

  // Booking endpoints
  async createBooking(bookingData: BookingData) {
    return this.request<{ success: boolean; booking_ref: string }>('/api/equipment/booking', {
      method: 'POST',
      body: bookingData as unknown as Record<string, unknown>,
    })
  }

  // Get available categories
  async getCategories() {
    return this.request<{ success: boolean; data: string[] }>('/api/equipment/categories')
  }
}

// Client-side API uses the Next.js API routes as proxy
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
export const api = new EquipmentApiClient(API_BASE_URL)
export default api