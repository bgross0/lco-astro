import useSWR from 'swr'
import { getEquipment, getEquipmentById, getFeaturedEquipment } from '@/lib/api/equipment'
import { checkAvailability } from '@/lib/api/booking'
import type { Vehicle, VehicleFilters, AvailabilityRequest } from '@/lib/types/api'

// Cache configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 30000, // 30 seconds
}

// Hook to fetch equipment list
export function useEquipment(filters?: VehicleFilters) {
  const key = filters
    ? ['equipment', filters]
    : 'equipment'

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getEquipment(filters),
    {
      ...swrConfig,
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    equipment: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    error,
    refresh: mutate
  }
}

// Hook to fetch single equipment
export function useEquipmentById(id: number | string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['equipment', id] : null,
    () => getEquipmentById(Number(id)),
    {
      ...swrConfig,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  return {
    equipment: data,
    isLoading,
    isError: error,
    error,
    refresh: mutate
  }
}

// Hook to fetch featured equipment
export function useFeaturedEquipment() {
  const { data, error, isLoading, mutate } = useSWR(
    'featured-equipment',
    getFeaturedEquipment,
    {
      ...swrConfig,
      refreshInterval: 120000, // Refresh every 2 minutes
    }
  )

  return {
    equipment: data || [],
    isLoading,
    isError: error,
    error,
    refresh: mutate
  }
}

// Hook to check availability
export function useAvailability(request: AvailabilityRequest | null) {
  const key = request
    ? ['availability', request.vehicle_id, request.date_from, request.date_to]
    : null

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => request ? checkAvailability(request) : null,
    {
      ...swrConfig,
      refreshInterval: 15000, // Refresh every 15 seconds
    }
  )

  return {
    availability: data,
    isAvailable: data?.available,
    estimatedPrice: data?.estimated_price,
    isLoading,
    isError: error,
    error,
    refresh: mutate
  }
}