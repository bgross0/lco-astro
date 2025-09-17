import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

// Event store for SSE broadcasting
export const bookingEvents: Array<{
  id: string
  timestamp: number
  type: string
  data: any
}> = []

// Webhook secret for signature verification (should be in env)
const WEBHOOK_SECRET = process.env.ODOO_WEBHOOK_SECRET || 'your-webhook-secret'

// Verify webhook signature (if Odoo implements it)
function verifyWebhookSignature(payload: string, signature: string): boolean {
  // If no secret is configured, skip verification (not recommended for production)
  if (!WEBHOOK_SECRET || WEBHOOK_SECRET === 'your-webhook-secret') {
    console.warn('Webhook signature verification disabled - no secret configured')
    return true
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// Broadcast event to SSE clients
export function broadcastBookingEvent(event: any) {
  const eventData = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    type: event.type || 'booking.update',
    data: event
  }

  // Keep only last 100 events
  bookingEvents.push(eventData)
  if (bookingEvents.length > 100) {
    bookingEvents.shift()
  }

  console.log('Broadcasting booking event:', eventData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('x-webhook-signature') || ''

    // Verify signature if provided
    if (signature && !verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse the webhook payload
    const event = JSON.parse(body)

    console.log('Received booking webhook:', event)

    // Process different event types
    switch (event.event_type) {
      case 'booking.created':
        console.log('New booking created:', event.booking_ref)
        // Update local cache, send notifications, etc.
        broadcastBookingEvent({
          type: 'booking.created',
          booking_ref: event.booking_ref,
          vehicle_id: event.vehicle_id,
          customer_email: event.customer_email,
          date_from: event.date_from,
          date_to: event.date_to
        })
        break

      case 'booking.confirmed':
        console.log('Booking confirmed:', event.booking_ref)
        broadcastBookingEvent({
          type: 'booking.confirmed',
          booking_ref: event.booking_ref,
          confirmed_at: new Date().toISOString()
        })
        break

      case 'booking.cancelled':
        console.log('Booking cancelled:', event.booking_ref)
        broadcastBookingEvent({
          type: 'booking.cancelled',
          booking_ref: event.booking_ref,
          cancelled_at: new Date().toISOString(),
          reason: event.cancellation_reason
        })
        break

      case 'booking.modified':
        console.log('Booking modified:', event.booking_ref)
        broadcastBookingEvent({
          type: 'booking.modified',
          booking_ref: event.booking_ref,
          changes: event.changes
        })
        break

      default:
        console.log('Unknown booking event type:', event.event_type)
    }

    // Store event for audit
    // TODO: Store in database
    const auditLog = {
      timestamp: new Date().toISOString(),
      event_type: event.event_type,
      booking_ref: event.booking_ref,
      raw_event: event
    }
    console.log('Audit log:', auditLog)

    // Return success
    return NextResponse.json({ success: true, received: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
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
      'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Signature',
    },
  })
}