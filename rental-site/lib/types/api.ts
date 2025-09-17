// API Response Types matching Odoo atlas_equipment_rental module

export interface Vehicle {
  id: number
  name: string
  slug: string
  brand: string
  model: string
  year: number
  listing_type: 'sale' | 'rental' | 'both'
  sale_price: number
  rental_price_daily: number
  rental_price_weekly?: number
  rental_price_monthly?: number
  currency: string
  fuel_type: string
  seats: number
  doors: number
  availability_status: 'available' | 'reserved' | 'rented' | 'maintenance' | 'sold'
  featured: boolean
  short_description: string
  primary_image: string | null
  view_count: number
  // Detail fields
  full_description?: string
  specifications?: Record<string, any>
  features?: VehicleFeature[]
  images?: VehicleImage[]
  video_url?: string
  virtual_tour_url?: string
  rental_terms?: string
  minimum_rental_days?: number
  maximum_rental_days?: number
  inquiry_count?: number
  booking_count?: number
}

export interface VehicleFeature {
  id: number
  name: string
  category: string
  icon: string
}

export interface VehicleImage {
  id: number
  name: string
  url: string
  is_primary: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number
    limit: number
    offset: number
    has_more: boolean
  }
}

export interface VehicleFilters {
  listing_type?: 'sale' | 'rental' | 'both'
  brand_id?: number
  fuel_type?: string
  min_price?: number
  max_price?: number
  available_from?: string
  available_to?: string
  featured?: boolean
  limit?: number
  offset?: number
}

export interface AvailabilityRequest {
  vehicle_id: number
  date_from: string
  date_to: string
}

export interface AvailabilityResponse {
  success: boolean
  available: boolean
  vehicle_id: number
  days: number
  estimated_price: number
  daily_rate: number
  currency: string
}

export interface BookingRequest {
  vehicle_id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  date_from: string
  date_to: string
  booking_type?: 'inquiry' | 'reservation' | 'test_drive'
  pickup_location?: string
  return_location?: string
  message?: string
}

export interface BookingResponse {
  success: boolean
  booking_ref: string
  booking_id: number
  message: string
  estimated_price: number
  currency: string
}

export interface FilterOptions {
  brands: Array<{ id: number; name: string }>
  fuel_types: Array<{ value: string; label: string }>
  listing_types: Array<{ value: string; label: string }>
  price_range: {
    min: number
    max: number
  }
}

export interface FiltersResponse extends ApiResponse<FilterOptions> {
  filters?: FilterOptions
}