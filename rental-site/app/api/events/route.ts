import { NextRequest } from 'next/server'
import { connections, formatSSE, broadcastToClients, bookingEvents, inventoryEvents } from '@/lib/sse-broadcaster'

// Polling interval for availability checks (5 minutes)
const POLLING_INTERVAL = 5 * 60 * 1000

// Start polling for updates (fallback mechanism)
let pollingInterval: NodeJS.Timeout | null = null

function startPolling() {
  if (pollingInterval) return

  pollingInterval = setInterval(async () => {
    try {
      // Poll for critical updates
      // In production, this would check Odoo for changes
      const heartbeat = {
        type: 'heartbeat',
        timestamp: Date.now(),
        message: 'Connection alive'
      }
      broadcastToClients(heartbeat)
    } catch (error) {
      console.error('Polling error:', error)
    }
  }, POLLING_INTERVAL)
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

export async function GET(request: NextRequest) {
  // Start polling if not already started
  if (connections.size === 0) {
    startPolling()
  }

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Add to connections
      connections.add(controller)

      // Send initial connection message
      const welcomeMessage = formatSSE({
        type: 'connected',
        timestamp: Date.now(),
        message: 'Connected to LCO real-time updates'
      })
      controller.enqueue(new TextEncoder().encode(welcomeMessage))

      // Send any recent events (last 10)
      const recentEvents = [
        ...bookingEvents.slice(-5),
        ...inventoryEvents.slice(-5)
      ].sort((a, b) => a.timestamp - b.timestamp).slice(-10)

      if (recentEvents.length > 0) {
        const recentMessage = formatSSE({
          type: 'recent_events',
          events: recentEvents
        })
        controller.enqueue(new TextEncoder().encode(recentMessage))
      }

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = formatSSE({
            type: 'heartbeat',
            timestamp: Date.now()
          })
          controller.enqueue(new TextEncoder().encode(heartbeat))
        } catch (error) {
          // Connection closed
          clearInterval(heartbeatInterval)
          connections.delete(controller)
        }
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        connections.delete(controller)

        // Stop polling if no connections
        if (connections.size === 0) {
          stopPolling()
        }

        controller.close()
      })
    },
  })

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}