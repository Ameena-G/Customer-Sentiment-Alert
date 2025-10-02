import { useEffect, useState, useCallback } from 'react'

interface WebSocketMessage {
  type: string
  data: any
}

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null

    const connect = () => {
      try {
        ws = new WebSocket(url)

        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          setSocket(ws)
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setIsConnected(false)
          setSocket(null)
          
          // Auto-reconnect after 2 seconds
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect...')
            connect()
          }, 2000)
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            setLastMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
      } catch (error) {
        console.error('Failed to create WebSocket:', error)
      }
    }

    connect()

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (ws) {
        ws.close()
      }
    }
  }, [url])

  const sendMessage = useCallback(
    (message: any) => {
      if (socket && isConnected && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message))
      }
    },
    [socket, isConnected]
  )

  return { socket, isConnected, lastMessage, sendMessage }
}
