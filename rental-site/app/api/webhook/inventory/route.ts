import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

// Event store for SSE broadcasting
export const inventoryEvents: Array<{
  id: string
  timestamp: number
  type: string
  data: any
}> = []

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.ODOO_WEBHOOK_SECRET || 'your-webhook-secret'

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
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
export function broadcastInventoryEvent(event: any) {
  const eventData = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    type: event.type || 'inventory.update',
    data: event
  }

  // Keep only last 100 events
  inventoryEvents.push(eventData)
  if (inventoryEvents.length > 100) {
    inventoryEvents.shift()
  }

  console.log('Broadcasting inventory event:', eventData)
}

// Cache invalidation helper
function invalidateCache(vehicleId?: number) {
  // TODO: Implement cache invalidation
  // This would clear cached data for the specific vehicle or all vehicles
  console.log('Cache invalidation requested for vehicle:', vehicleId || 'all')
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

    console.log('Received inventory webhook:', event)

    // Process different event types
    switch (event.event_type) {
      case 'vehicle.availability_changed':
        console.log('Vehicle availability changed:', event.vehicle_id)
        invalidateCache(event.vehicle_id)
        broadcastInventoryEvent({
          type: 'availability.changed',
          vehicle_id: event.vehicle_id,
          availability_status: event.availability_status,
          available_from: event.available_from,
          available_to: event.available_to
        })
        break

      case 'vehicle.added':
        console.log('New vehicle added:', event.vehicle_id)
        invalidateCache()
        broadcastInventoryEvent({
          type: 'vehicle.added',
          vehicle_id: event.vehicle_id,
          name: event.name,
          category: event.category
        })
        break

      case 'vehicle.updated':
        console.log('Vehicle updated:', event.vehicle_id)
        invalidateCache(event.vehicle_id)
        broadcastInventoryEvent({
          type: 'vehicle.updated',
          vehicle_id: event.vehicle_id,
          changes: event.changes
        })
        break

      case 'vehicle.removed':
        console.log('Vehicle removed:', event.vehicle_id)
        invalidateCache(event.vehicle_id)
        broadcastInventoryEvent({
          type: 'vehicle.removed',
          vehicle_id: event.vehicle_id
        })
        break

      case 'vehicle.maintenance':
        console.log('Vehicle maintenance status:', event.vehicle_id)
        invalidateCache(event.vehicle_id)
        broadcastInventoryEvent({
          type: 'maintenance.status',
          vehicle_id: event.vehicle_id,
          in_maintenance: event.in_maintenance,
          maintenance_until: event.maintenance_until
        })
        break

      case 'price.updated':
        console.log('Price updated for vehicle:', event.vehicle_id)
        invalidateCache(event.vehicle_id)
        broadcastInventoryEvent({
          type: 'price.updated',
          vehicle_id: event.vehicle_id,
          rental_price_daily: event.rental_price_daily,
          rental_price_weekly: event.rental_price_weekly,
          rental_price_monthly: event.rental_price_monthly
        })
        break

      default:
        console.log('Unknown inventory event type:', event.event_type)
    }

    // Store event for audit
    const auditLog = {
      timestamp: new Date().toISOString(),
      event_type: event.event_type,
      vehicle_id: event.vehicle_id,
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