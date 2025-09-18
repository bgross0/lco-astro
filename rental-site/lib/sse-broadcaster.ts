import crypto from 'crypto'

// SSE connections store
export const connections = new Set<ReadableStreamDefaultController>()

// Event stores for SSE broadcasting
export const bookingEvents: Array<{
  id: string
  timestamp: number
  type: string
  data: any
}> = []

export const inventoryEvents: Array<{
  id: string
  timestamp: number
  type: string
  data: any
}> = []

// Helper to format SSE message
export function formatSSE(data: any): string {
  const lines = JSON.stringify(data).split('\n')
  const message = lines.map(line => `data: ${line}`).join('\n')
  return `${message}\n\n`
}

// Broadcast to all connected clients
export function broadcastToClients(event: any) {
  const message = formatSSE(event)
  connections.forEach(controller => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      // Connection might be closed
      connections.delete(controller)
    }
  })
}

// Broadcast booking event
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
  broadcastToClients(eventData)
}

// Broadcast inventory event
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
  broadcastToClients(eventData)
}