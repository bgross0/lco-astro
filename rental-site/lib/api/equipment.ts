// Equipment API service layer

import { apiGet } from './client'
import type {
  Vehicle,
  PaginatedResponse,
  VehicleFilters,
  FiltersResponse,
  FilterOptions,
} from '@/lib/types/api'

/**
 * Fetch list of vehicles/equipment from Odoo
 */
export async function getEquipment(
  filters?: VehicleFilters
): Promise<PaginatedResponse<Vehicle>> {
  return apiGet<PaginatedResponse<Vehicle>>('/api/fleet/vehicles', filters)
}

/**
 * Fetch single vehicle/equipment details
 */
export async function getEquipmentById(id: number): Promise<Vehicle> {
  const response = await apiGet<{ success: boolean; data: Vehicle }>(
    `/api/fleet/vehicle/${id}`
  )

  if (!response.success || !response.data) {
    throw new Error('Equipment not found')
  }

  return response.data
}

/**
 * Get available filter options
 */
export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await apiGet<FiltersResponse>('/api/fleet/filters')

  if (!response.success || !response.filters) {
    throw new Error('Failed to fetch filter options')
  }

  return response.filters
}

/**
 * Search equipment by keyword
 */
export async function searchEquipment(
  query: string,
  filters?: Omit<VehicleFilters, 'limit' | 'offset'>
): Promise<Vehicle[]> {
  const response = await getEquipment({
    ...filters,
    limit: 50, // Search returns more results
  })

  if (!response.data) {
    return []
  }

  // Client-side filtering by search query
  const searchLower = query.toLowerCase()
  return response.data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower) ||
      item.model.toLowerCase().includes(searchLower) ||
      item.short_description?.toLowerCase().includes(searchLower)
  )
}

/**
 * Get featured equipment for homepage
 */
export async function getFeaturedEquipment(): Promise<Vehicle[]> {
  const response = await getEquipment({
    featured: true,
    limit: 6,
  })

  return response.data || []
}

/**
 * Get equipment by category
 */
export async function getEquipmentByCategory(
  category: string
): Promise<Vehicle[]> {
  // Note: This would need to be implemented in Odoo API
  // For now, fetch all and filter client-side
  const response = await getEquipment({ limit: 100 })

  if (!response.data) {
    return []
  }

  // Map our categories to Odoo fuel_type or other fields
  // This mapping would depend on how categories are stored in Odoo
  const categoryMapping: Record<string, string[]> = {
    'Snow Removal': ['diesel', 'gas'],
    'Lawn Care': ['gas', 'electric'],
    'Landscaping': ['diesel', 'gas'],
    'Heavy Equipment': ['diesel'],
    'Power Tools': ['electric', 'battery'],
  }

  const fuelTypes = categoryMapping[category]
  if (!fuelTypes) {
    return response.data
  }

  return response.data.filter((item) =>
    fuelTypes.includes(item.fuel_type?.toLowerCase())
  )
}

/**
 * Convert Odoo vehicle to our Equipment interface
 */
export function vehicleToEquipment(vehicle: Vehicle) {
  return {
    id: vehicle.id,
    name: vehicle.name,
    category: mapFuelTypeToCategory(vehicle.fuel_type),
    description: vehicle.short_description,
    hourly_rate: Math.round(vehicle.rental_price_daily / 8), // Estimate hourly from daily
    daily_rate: vehicle.rental_price_daily,
    weekly_rate: vehicle.rental_price_weekly || vehicle.rental_price_daily * 5,
    available: vehicle.availability_status === 'available',
    image_url: vehicle.primary_image || undefined,
  }
}

/**
 * Map Odoo fuel type to our category system
 */
function mapFuelTypeToCategory(fuelType: string): string {
  const mapping: Record<string, string> = {
    'diesel': 'Heavy Equipment',
    'gas': 'Lawn Care',
    'gasoline': 'Lawn Care',
    'electric': 'Power Tools',
    'battery': 'Power Tools',
    'manual': 'Power Tools',
  }

  return mapping[fuelType?.toLowerCase()] || 'Landscaping'
}