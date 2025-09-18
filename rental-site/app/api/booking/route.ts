import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/api/booking'
import type { BookingRequest, BookingResponse } from '@/lib/types/api'

// In-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    // Reset rate limit every hour
    rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 })
    return true
  }

  if (limit.count >= 10) {
    // Max 10 bookings per hour per IP
    return false
  }

  limit.count++
  return true
}

// Email notification function (stub for now)
async function sendBookingConfirmationEmail(booking: BookingResponse, request: BookingRequest) {
  // TODO: Implement email service (SendGrid, Resend, etc.)
  console.log('Sending booking confirmation email:', {
    to: request.customer_email,
    bookingRef: booking.booking_ref
  })
}

// Log booking for analytics
async function logBooking(booking: BookingResponse, request: BookingRequest, ip: string, userAgent: string) {
  const logData = {
    timestamp: new Date().toISOString(),
    booking_ref: booking.booking_ref,
    booking_id: booking.booking_id,
    vehicle_id: request.vehicle_id,
    customer_email: request.customer_email,
    date_from: request.date_from,
    date_to: request.date_to,
    estimated_price: booking.estimated_price,
    currency: booking.currency,
    ip_address: ip,
    user_agent: userAgent
  }

  // TODO: Store in database or external logging service
  console.log('Booking logged:', logData)
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many booking attempts. Please try again later.',
          message: 'Rate limit exceeded'
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body: BookingRequest = await request.json()

    // Additional validation
    if (!body.vehicle_id || !body.customer_name || !body.customer_email ||
        !body.customer_phone || !body.date_from || !body.date_to) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Please fill in all required fields'
        },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedRequest: BookingRequest = {
      vehicle_id: Number(body.vehicle_id),
      customer_name: body.customer_name.trim().slice(0, 100),
      customer_email: body.customer_email.trim().toLowerCase().slice(0, 100),
      customer_phone: body.customer_phone.trim().slice(0, 20),
      date_from: body.date_from,
      date_to: body.date_to,
      booking_type: body.booking_type || 'reservation',
      pickup_location: body.pickup_location?.trim().slice(0, 100) || 'Main Office',
      return_location: body.return_location?.trim().slice(0, 100) || body.pickup_location?.trim().slice(0, 100) || 'Main Office',
      message: body.message?.trim().slice(0, 500) || ''
    }

    // Create booking through API
    const booking = await createBooking(sanitizedRequest)

    // Send confirmation email asynchronously
    sendBookingConfirmationEmail(booking, sanitizedRequest).catch(error => {
      console.error('Failed to send confirmation email:', error)
    })

    // Log booking asynchronously
    const userAgent = request.headers.get('user-agent') || 'unknown'
    logBooking(booking, sanitizedRequest, ip, userAgent).catch(error => {
      console.error('Failed to log booking:', error)
    })

    // Return success response
    return NextResponse.json(booking)

  } catch (error: any) {
    console.error('Booking API error:', error)

    // Handle specific error types
    if (error.message?.includes('not available')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: 'This equipment is not available for the selected dates. Please choose different dates.'
        },
        { status: 409 }
      )
    }

    if (error.message?.includes('past')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: 'Please select a future date for your rental.'
        },
        { status: 400 }
      )
    }

    if (error.message?.includes('Invalid')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: error.message
        },
        { status: 400 }
      )
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
        message: 'An error occurred while processing your booking. Please try again.'
      },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}