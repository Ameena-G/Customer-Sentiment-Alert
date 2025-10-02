import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface WebSocketMessage {
  type: string
  data: any
}

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  useEffect(() => {
    const newSocket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })

    newSocket.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    newSocket.on('message', (message: WebSocketMessage) => {
      setLastMessage(message)
    })

    // Handle custom events
    newSocket.onAny((event, data) => {
      if (event !== 'connect' && event !== 'disconnect') {
        setLastMessage({ type: event, data })
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [url])

  const sendMessage = useCallback(
    (message: any) => {
      if (socket && isConnected) {
        socket.emit('message', message)
      }
    },
    [socket, isConnected]
  )

  return { socket, isConnected, lastMessage, sendMessage }
}
