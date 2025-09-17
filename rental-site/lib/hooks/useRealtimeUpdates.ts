import { useEffect, useState, useCallback } from 'react'
import { mutate } from 'swr'

interface RealtimeEvent {
  type: string
  timestamp: number
  data?: any
}

export function useRealtimeUpdates() {
  const [connected, setConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle incoming events
  const handleEvent = useCallback((event: RealtimeEvent) => {
    console.log('Received real-time event:', event)
    setLastEvent(event)

    // Invalidate relevant SWR caches based on event type
    switch (event.type) {
      case 'availability.changed':
      case 'vehicle.updated':
      case 'price.updated':
        // Invalidate specific vehicle cache
        if (event.data?.vehicle_id) {
          mutate(['equipment', event.data.vehicle_id])
          mutate(
            (key: any) => Array.isArray(key) && key[0] === 'availability' && key[1] === event.data.vehicle_id,
            undefined,
            { revalidate: true }
          )
        }
        // Also invalidate equipment list
        mutate((key: any) => key === 'equipment' || (Array.isArray(key) && key[0] === 'equipment'))
        break

      case 'vehicle.added':
      case 'vehicle.removed':
        // Invalidate all equipment caches
        mutate((key: any) => key === 'equipment' || (Array.isArray(key) && key[0] === 'equipment'))
        mutate('featured-equipment')
        break

      case 'booking.created':
      case 'booking.confirmed':
      case 'booking.cancelled':
        // Invalidate availability for the vehicle
        if (event.data?.vehicle_id) {
          mutate(
            (key: any) => Array.isArray(key) && key[0] === 'availability' && key[1] === event.data.vehicle_id,
            undefined,
            { revalidate: true }
          )
        }
        break

      case 'heartbeat':
        // Just a keepalive, no action needed
        break

      default:
        console.log('Unhandled event type:', event.type)
    }
  }, [])

  useEffect(() => {
    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    let reconnectAttempts = 0

    const connect = () => {
      try {
        // Connect to SSE endpoint
        const url = '/api/events'
        eventSource = new EventSource(url)

        eventSource.onopen = () => {
          console.log('Connected to real-time updates')
          setConnected(true)
          setError(null)
          reconnectAttempts = 0
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            handleEvent(data)
          } catch (err) {
            console.error('Failed to parse SSE message:', err)
          }
        }

        eventSource.onerror = (err) => {
          console.error('SSE connection error:', err)
          setConnected(false)
          setError('Connection lost. Reconnecting...')

          // Close the connection
          if (eventSource) {
            eventSource.close()
          }

          // Exponential backoff for reconnection
          reconnectAttempts++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)

          reconnectTimeout = setTimeout(() => {
            console.log(`Reconnecting (attempt ${reconnectAttempts})...`)
            connect()
          }, delay)
        }

      } catch (err) {
        console.error('Failed to establish SSE connection:', err)
        setError('Failed to connect to real-time updates')
        setConnected(false)
      }
    }

    // Initial connection
    connect()

    // Cleanup
    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
    }
  }, [handleEvent])

  return {
    connected,
    lastEvent,
    error
  }
}

// Hook to subscribe to specific event types
export function useRealtimeEvent(eventType: string | string[], callback: (event: RealtimeEvent) => void) {
  const { lastEvent } = useRealtimeUpdates()

  useEffect(() => {
    if (!lastEvent) return

    const types = Array.isArray(eventType) ? eventType : [eventType]
    if (types.includes(lastEvent.type)) {
      callback(lastEvent)
    }
  }, [lastEvent, eventType, callback])
}