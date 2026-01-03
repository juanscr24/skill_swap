import { type StatCardConfig } from '@/types/dashboard'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

interface StatCardProps {
  config: StatCardConfig
}

export const StatCard = ({ config }: StatCardProps) => {
  const { icon: Icon, label, value, color, change, trend } = config

  return (
    <div className="bg-(--bg-2) rounded-xl p-6 border border-(--border-1) hover:border-(--button-1) transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-(--bg-1) ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        {/* Cambio respecto a la semana anterior */}
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-(--text-2)'
          }`}>
            {trend === 'up' && <FiTrendingUp className="w-4 h-4" />}
            {trend === 'down' && <FiTrendingDown className="w-4 h-4" />}
            <span>{change > 0 ? '+' : ''}{change}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-(--text-2) text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-(--text-1)">{value}</p>
      </div>
    </div>
  )
}
