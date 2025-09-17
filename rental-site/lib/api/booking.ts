// Booking API service layer

import { apiPost } from './client'
import type {
  BookingRequest,
  BookingResponse,
  AvailabilityRequest,
  AvailabilityResponse,
} from '@/lib/types/api'

/**
 * Check equipment availability for date range
 */
export async function checkAvailability(
  request: AvailabilityRequest
): Promise<AvailabilityResponse> {
  return apiPost<AvailabilityResponse>('/api/fleet/availability', request)
}

/**
 * Create a new booking/reservation
 */
export async function createBooking(
  request: BookingRequest
): Promise<BookingResponse> {
  // Validate dates
  const dateFrom = new Date(request.date_from)
  const dateTo = new Date(request.date_to)

  if (dateFrom >= dateTo) {
    throw new Error('End date must be after start date')
  }

  if (dateFrom < new Date()) {
    throw new Error('Start date cannot be in the past')
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(request.customer_email)) {
    throw new Error('Invalid email address')
  }

  // Validate phone (basic validation)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!phoneRegex.test(request.customer_phone)) {
    throw new Error('Invalid phone number')
  }

  return apiPost<BookingResponse>('/api/fleet/booking', request)
}

/**
 * Calculate rental price for a date range
 */
export async function calculateRentalPrice(
  vehicleId: number,
  dateFrom: string,
  dateTo: string
): Promise<{
  days: number
  total: number
  dailyRate: number
  currency: string
}> {
  const availability = await checkAvailability({
    vehicle_id: vehicleId,
    date_from: dateFrom,
    date_to: dateTo,
  })

  return {
    days: availability.days,
    total: availability.estimated_price,
    dailyRate: availability.daily_rate,
    currency: availability.currency,
  }
}

/**
 * Get blocked dates for a vehicle (dates when it's not available)
 */
export async function getBlockedDates(
  vehicleId: number,
  startDate: Date,
  endDate: Date
): Promise<Date[]> {
  const blockedDates: Date[] = []

  // Check each day in the range
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]

    try {
      const availability = await checkAvailability({
        vehicle_id: vehicleId,
        date_from: dateStr,
        date_to: dateStr,
      })

      if (!availability.available) {
        blockedDates.push(new Date(currentDate))
      }
    } catch (error) {
      // If error checking availability, consider it blocked
      blockedDates.push(new Date(currentDate))
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return blockedDates
}

/**
 * Format booking data for submission
 */
export function formatBookingRequest(
  formData: any,
  vehicleId: number
): BookingRequest {
  return {
    vehicle_id: vehicleId,
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    date_from: formData.startDate,
    date_to: formData.endDate,
    booking_type: formData.bookingType || 'reservation',
    pickup_location: formData.pickupLocation || 'Main Office',
    return_location: formData.returnLocation || formData.pickupLocation || 'Main Office',
    message: formData.message || '',
  }
}

/**
 * Validate booking dates
 */
export function validateBookingDates(
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (start < today) {
    return { valid: false, error: 'Start date cannot be in the past' }
  }

  if (end <= start) {
    return { valid: false, error: 'End date must be after start date' }
  }

  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff > 30) {
    return { valid: false, error: 'Maximum rental period is 30 days' }
  }

  return { valid: true }
}