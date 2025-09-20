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
  const response = await apiGet<any>('/api/fleet/vehicles', filters)

  // Handle the response structure from API documentation
  if (response.success && response.data) {
    return response as PaginatedResponse<Vehicle>
  }

  // Handle empty or error responses
  return {
    success: false,
    data: [],
    pagination: {
      total: 0,
      limit: filters?.limit || 20,
      offset: filters?.offset || 0,
      has_more: false
    }
  }
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
  return response.data.filter((item) => {
    // Check name (always present)
    if (item.name && item.name.toLowerCase().includes(searchLower)) {
      return true
    }
    // Check optional fields if they exist and are strings
    if (typeof item.brand === 'string' && item.brand.toLowerCase().includes(searchLower)) {
      return true
    }
    if (typeof item.model === 'string' && item.model.toLowerCase().includes(searchLower)) {
      return true
    }
    if (typeof item.short_description === 'string' &&
        item.short_description.toLowerCase().includes(searchLower)) {
      return true
    }
    return false
  })
}

/**
 * Get featured equipment for homepage
 */
export async function getFeaturedEquipment(): Promise<Vehicle[]> {
  try {
    const response = await getEquipment({
      featured: true,
      limit: 6,
    })

    return response.data || []
  } catch (error) {
    console.error('Failed to fetch featured equipment:', error)
    return []
  }
}

/**
 * Get equipment by category
 */
export async function getEquipmentByCategory(
  category: string
): Promise<Vehicle[]> {
  try {
    // Note: This would need to be implemented in Odoo API
    // For now, fetch all and filter client-side
    const response = await getEquipment({ limit: 100 })

    if (!response.data) {
      return []
    }

    // Map our categories to Odoo fuel_type or other fields
    // This mapping would depend on how categories are stored in Odoo
    const categoryMapping: Record<string, string[]> = {
      'Snow Removal': ['diesel', 'gas', 'gasoline'],
      'Lawn Care': ['gas', 'gasoline', 'electric'],
      'Landscaping': ['diesel', 'gas', 'gasoline'],
      'Heavy Equipment': ['diesel'],
      'Power Tools': ['electric', 'battery'],
    }

    const fuelTypes = categoryMapping[category]
    if (!fuelTypes) {
      return response.data
    }

    return response.data.filter((item) => {
      if (typeof item.fuel_type === 'string') {
        return fuelTypes.includes(item.fuel_type.toLowerCase())
      }
      return false
    })
  } catch (error) {
    console.error(`Failed to fetch equipment by category ${category}:`, error)
    return []
  }
}

/**
 * Convert Odoo vehicle to our Equipment interface
 */
export function vehicleToEquipment(vehicle: Vehicle) {
  // Use the primary_image URL from API if available (with attachment=True fix)
  // Otherwise construct URL as fallback
  let imageUrl: string
  if (vehicle.primary_image) {
    // Use the URL provided by the API (may be full URL or relative)
    imageUrl = vehicle.primary_image.startsWith('http')
      ? vehicle.primary_image
      : `/web/image/fleet.vehicle/${vehicle.id}/image_1920`
  } else {
    // Fallback: construct relative path that gets proxied to Odoo
    imageUrl = `/web/image/fleet.vehicle/${vehicle.id}/image_1920`
  }

  // Determine category - use Odoo's category field if available, otherwise derive from name
  let category = 'Equipment' // Default
  if (vehicle.category) {
    // Map Odoo categories to our display categories
    const categoryMap: Record<string, string> = {
      // Skid Steer variations
      'skidsteer': 'Skid Steers',
      'skid_steer': 'Skid Steers',
      'skid steer': 'Skid Steers',
      'skid steers': 'Skid Steers',
      // Excavator variations
      'excavator': 'Excavators',
      'excavators': 'Excavators',
      'mini_excavator': 'Excavators',
      'mini excavator': 'Excavators',
      // Trailer variations
      'trailer': 'Trailers',
      'trailers': 'Trailers',
      'dump_trailer': 'Trailers',
      'dump trailer': 'Trailers',
      'equipment_trailer': 'Trailers',
      'equipment trailer': 'Trailers',
      // Loader variations
      'loader': 'Loaders',
      'loaders': 'Loaders',
      'wheel_loader': 'Loaders',
      'wheel loader': 'Loaders',
      'backhoe': 'Loaders',
      // Power Tools variations
      'power_tool': 'Power Tools',
      'power tool': 'Power Tools',
      'power tools': 'Power Tools',
      'chainsaw': 'Power Tools',
      'generator': 'Power Tools',
      'compressor': 'Power Tools',
      // Attachments variations
      'attachment': 'Attachments',
      'attachments': 'Attachments'
    }

    // Debug logging to see what Odoo is actually sending
    console.log('Odoo category value:', vehicle.category, 'for vehicle:', vehicle.name)

    // Map the category, keeping the default if no match found
    const mappedCategory = categoryMap[vehicle.category.toLowerCase()]
    if (mappedCategory) {
      category = mappedCategory
    } else {
      // Keep the default 'Equipment' instead of forcing 'Skid Steers'
      console.warn(`Unknown category '${vehicle.category}' for vehicle '${vehicle.name}', using default 'Equipment'`)
    }
  } else if (vehicle.name) {
    // Name-based categorization for our new categories
    const nameLower = vehicle.name.toLowerCase()
    if (nameLower.includes('cat') || nameLower.includes('skid')) {
      category = 'Skid Steers'
    } else if (nameLower.includes('excavator') || nameLower.includes('mini ex')) {
      category = 'Excavators'
    } else if (nameLower.includes('trailer')) {
      category = 'Trailers'
    } else if (nameLower.includes('loader') || nameLower.includes('backhoe')) {
      category = 'Loaders'
    } else if (nameLower.includes('chainsaw') || nameLower.includes('generator') ||
               nameLower.includes('compressor') || nameLower.includes('tool')) {
      category = 'Power Tools'
    }
  }

  return {
    id: vehicle.id,
    name: vehicle.name || 'Equipment',
    category,
    description: '', // Not needed for basic display
    hourly_rate: Math.round(vehicle.rental_price_daily / 8), // Estimate if needed
    daily_rate: vehicle.rental_price_daily || 0,
    weekly_rate: vehicle.rental_price_weekly || vehicle.rental_price_daily * 5,
    available: vehicle.availability_status === 'available',
    image_url: imageUrl,
  }
}

/**
 * Map Odoo fuel type to our category system
 * Enhanced mapping based on fuel type and name patterns
 */
function mapFuelTypeToCategory(fuelType: string | boolean | false | undefined, vehicleName?: string): string {
  // Check name patterns first for more accurate categorization
  if (vehicleName && typeof vehicleName === 'string') {
    const nameLower = vehicleName.toLowerCase()
    if (nameLower.includes('skid') || nameLower.includes('cat')) {
      return 'Skid Steers'
    }
    if (nameLower.includes('excavator') || nameLower.includes('mini ex')) {
      return 'Excavators'
    }
    if (nameLower.includes('trailer')) {
      return 'Trailers'
    }
    if (nameLower.includes('loader') || nameLower.includes('backhoe')) {
      return 'Loaders'
    }
    if (nameLower.includes('chainsaw') || nameLower.includes('generator') ||
        nameLower.includes('compressor') || nameLower.includes('tool')) {
      return 'Power Tools'
    }
  }

  // Handle false/null/undefined fuel type
  if (typeof fuelType !== 'string') {
    return 'Equipment' // Default category
  }

  // Fallback to fuel type mapping for our new categories
  const mapping: Record<string, string> = {
    'diesel': 'Skid Steers', // Most diesel equipment is heavy machinery
    'gas': 'Power Tools',
    'gasoline': 'Power Tools',
    'electric': 'Power Tools',
    'battery': 'Power Tools',
    'manual': 'Power Tools',
  }

  return mapping[fuelType.toLowerCase()] || 'Equipment'
}