import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings,
  Bell,
  TrendingUp
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'queries', label: 'Queries', icon: MessageSquare },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SentiGuard
        </h2>
        <p className="text-xs text-slate-500 mt-1">Sentiment Monitor</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-700 mb-1">Pro Tip</p>
          <p className="text-xs text-slate-600">
            Enable voice alerts for instant crisis notifications
          </p>
        </div>
      </div>
    </aside>
  )
}
