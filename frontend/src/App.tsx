import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import { useWebSocket } from './hooks/useWebSocket'
import { api } from './lib/api'
import { AlertCircle } from 'lucide-react'

export interface SentimentRecord {
  id: number
  source: string
  source_id: string
  text: string
  sentiment_score: number
  sentiment_label: string
  confidence: number
  emotions: Record<string, number>
  author: string
  created_at: string
  processed_at: string
}

export interface Alert {
  id: number
  severity: string
  title: string
  message: string
  sentiment_record_id: number
  suggested_response: string
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
}

export interface Stats {
  total: number
  positive: number
  negative: number
  neutral: number
  average_score: number
  by_source: Record<string, { count: number; avg_score: number }>
}

function App() {
  const [sentiments, setSentiments] = useState<SentimentRecord[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isConnected, lastMessage } = useWebSocket('ws://localhost:8000/ws')

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [sentimentsData, alertsData, statsData] = await Promise.all([
          api.getSentiments(50),
          api.getAlerts(20),
          api.getStats(24),
        ])
        setSentiments(sentimentsData)
        setAlerts(alertsData)
        setStats(statsData)
        setError(null)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load data. Make sure the backend is running on port 8000.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return

    if (lastMessage.type === 'sentiment') {
      setSentiments((prev) => [lastMessage.data, ...prev].slice(0, 100))
      // Refresh stats
      api.getStats(24).then(setStats)
    } else if (lastMessage.type === 'alert') {
      setAlerts((prev) => [lastMessage.data, ...prev])
    }
  }, [lastMessage])

  const handleResolveAlert = async (alertId: number) => {
    try {
      await api.resolveAlert(alertId)
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, is_resolved: true } : alert
        )
      )
    } catch (err) {
      console.error('Failed to resolve alert:', err)
    }
  }

  const handleTriggerCrisis = async () => {
    try {
      await api.triggerCrisis()
    } catch (err) {
      console.error('Failed to trigger crisis:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SentiGuard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Connection Error</h2>
          <p className="text-muted-foreground text-center mb-4">{error}</p>
          <div className="bg-muted p-4 rounded-md text-sm">
            <p className="font-semibold mb-2">Quick Fix:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Navigate to backend folder</li>
              <li>Run: <code className="bg-slate-200 px-1 rounded">python app.py</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dashboard
      sentiments={sentiments}
      alerts={alerts}
      stats={stats}
      isConnected={isConnected}
      onResolveAlert={handleResolveAlert}
      onTriggerCrisis={handleTriggerCrisis}
    />
  )
}

export default App
