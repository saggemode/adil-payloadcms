import { useEffect, useCallback } from 'react'
import { websocketService } from '../services/websocket'

export const useWebSocket = () => {
  useEffect(() => {
    websocketService.connect()

    return () => {
      websocketService.disconnect()
    }
  }, [])

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    websocketService.subscribe(event, callback)

    return () => {
      websocketService.unsubscribe(event, callback)
    }
  }, [])

  const emit = useCallback((event: string, data: any) => {
    websocketService.emit(event, data)
  }, [])

  return {
    subscribe,
    emit,
  }
}
