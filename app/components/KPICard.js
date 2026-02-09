'use client'

export default function KPICard({ label, value, prefix = '', suffix = '', icon: Icon }) {
  return (
    <div className="kpi-card cursor-default group">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-mpj-purple/10 flex items-center justify-center group-hover:bg-mpj-purple/20 transition-colors">
            <Icon size={16} className="text-mpj-purple" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-mpj-purple leading-tight">
        {prefix}{value}{suffix}
      </p>
    </div>
  )
}
