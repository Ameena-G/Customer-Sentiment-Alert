import { BarChart3, TrendingUp, TrendingDown, Activity, PieChart } from 'lucide-react'
import { SentimentRecord, Stats } from '../App'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts'

interface AnalyticsPanelProps {
  sentiments: SentimentRecord[]
  stats: Stats | null
}

export default function AnalyticsPanel({ sentiments, stats }: AnalyticsPanelProps) {
  // Calculate sentiment distribution
  const sentimentDistribution = [
    { name: 'Positive', value: stats?.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: stats?.neutral || 0, color: '#6b7280' },
    { name: 'Negative', value: stats?.negative || 0, color: '#ef4444' },
  ]

  // Calculate source breakdown
  const sourceData = stats?.by_source 
    ? Object.entries(stats.by_source).map(([source, data]) => ({
        source: source.charAt(0).toUpperCase() + source.slice(1),
        count: data.count,
        avgScore: data.avg_score
      }))
    : []

  // Calculate hourly distribution (mock data for demo)
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    count: Math.floor(Math.random() * 50) + 10
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h2>
        <p className="text-slate-600">Comprehensive sentiment analysis and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Mentions"
          value={stats?.total || 0}
          icon={<Activity className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Positive Rate"
          value={`${stats ? Math.round((stats.positive / stats.total) * 100) : 0}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <MetricCard
          title="Negative Rate"
          value={`${stats ? Math.round((stats.negative / stats.total) * 100) : 0}%`}
          icon={<TrendingDown className="h-6 w-6" />}
          color="red"
        />
        <MetricCard
          title="Avg Sentiment"
          value={stats?.average_score.toFixed(2) || '0.00'}
          icon={<BarChart3 className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-600" />
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={sentimentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Source Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">24-Hour Activity Pattern</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Keywords */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Mentioned Keywords</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['customer service', 'product quality', 'delivery', 'support', 'price', 'features', 'update', 'bug'].map((keyword, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-slate-700">{keyword}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{Math.floor(Math.random() * 100) + 20}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'purple'
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
