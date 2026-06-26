import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  color: string
  description?: string
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon: Icon, 
  color,
  description 
}: StatsCardProps) {
  return (
    <div className="card-hover p-6 relative overflow-hidden group">
      {/* Arrière-plan décoratif */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`}></div>
      
      <div className="relative">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>

        {/* Valeur principale */}
        <div className="mb-2">
          <div className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-sm font-medium text-gray-600">{title}</div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  )
}

// Cartes de statistiques prédéfinies
export function RevenueCard({ value, change }: { value: number; change?: string }) {
  return (
    <StatsCard
      title="Revenus Mensuels"
      value={`${value.toLocaleString()} USD`}
      change={change}
      changeType="increase"
      icon={CurrencyDollarIcon}
      color="bg-gradient-to-br from-green-500 to-emerald-600"
      description="En hausse ce mois-ci"
    />
  )
}

export function TransportsCard({ value, change }: { value: number; change?: string }) {
  return (
    <StatsCard
      title="Transports Actifs"
      value={value}
      change={change}
      changeType="increase"
      icon={TruckIcon}
      color="bg-gradient-to-br from-blue-500 to-indigo-600"
      description="+8 cette semaine"
    />
  )
}

export function ClientsCard({ value, change }: { value: number; change?: string }) {
  return (
    <StatsCard
      title="Clients Satisfaits"
      value={`${value}%`}
      change={change}
      changeType="increase"
      icon={UserGroupIcon}
      color="bg-gradient-to-br from-purple-500 to-pink-600"
      description="Taux de satisfaction"
    />
  )
}

export function DeliveryCard({ value, change }: { value: number; change?: string }) {
  return (
    <StatsCard
      title="Taux de Livraison"
      value={`${value}%`}
      change={change}
      changeType="decrease"
      icon={ShieldCheckIcon}
      color="bg-gradient-to-br from-orange-500 to-red-600"
      description="Légère baisse"
    />
  )
}
