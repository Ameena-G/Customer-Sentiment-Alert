import { useState } from 'react'
import { Activity, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import SentimentChart from './SentimentChart'
import AlertPanel from './AlertPanel'
import SourceMonitor from './SourceMonitor'
import InsightsPanel from './InsightsPanel'
import type { SentimentRecord, Alert, Stats } from '../App'

interface DashboardProps {
  sentiments: SentimentRecord[]
  alerts: Alert[]
  stats: Stats | null
  isConnected: boolean
  onResolveAlert: (alertId: number) => void
  onTriggerCrisis: () => void
}

export default function Dashboard({
  sentiments,
  alerts,
  stats,
  isConnected,
  onResolveAlert,
  onTriggerCrisis,
}: DashboardProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  const filteredSentiments = selectedSource
    ? sentiments.filter((s) => s.source === selectedSource)
    : sentiments

  const unresolvedAlerts = alerts.filter((a) => !a.is_resolved)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">SentiGuard</h1>
                <p className="text-sm text-slate-600">
                  Real-time Customer Sentiment Monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-slate-600">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={onTriggerCrisis}
                className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                🚨 Demo Crisis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Mentions"
            value={stats?.total || 0}
            icon={<Activity className="h-5 w-5" />}
            color="blue"
          />
          <StatCard
            title="Positive"
            value={stats?.positive || 0}
            icon={<TrendingUp className="h-5 w-5" />}
            color="green"
            percentage={stats ? Math.round((stats.positive / stats.total) * 100) : 0}
          />
          <StatCard
            title="Negative"
            value={stats?.negative || 0}
            icon={<AlertTriangle className="h-5 w-5" />}
            color="red"
            percentage={stats ? Math.round((stats.negative / stats.total) * 100) : 0}
          />
          <StatCard
            title="Active Alerts"
            value={unresolvedAlerts.length}
            icon={<Zap className="h-5 w-5" />}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Feed */}
          <div className="lg:col-span-2 space-y-6">
            <SentimentChart sentiments={sentiments} />
            <SourceMonitor
              sentiments={filteredSentiments}
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
            />
          </div>

          {/* Right Column - Alerts and Insights */}
          <div className="space-y-6">
            <AlertPanel alerts={unresolvedAlerts} onResolve={onResolveAlert} />
            <InsightsPanel sentiments={sentiments} stats={stats} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'orange'
  percentage?: number
}

function StatCard({ title, value, icon, color, percentage }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {percentage !== undefined && (
          <span className="text-sm text-slate-500">({percentage}%)</span>
        )}
      </div>
    </div>
  )
}
