'use client'

export default function KPICard({ label, value, prefix = '', suffix = '', icon: Icon, subtext, trend }) {
  return (
    <div className="kpi-card animate-count-up">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-tight">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-mpj-gold-xlight flex items-center justify-center group-hover:bg-mpj-gold-light/40 transition-colors flex-shrink-0">
            <Icon size={15} className="text-mpj-gold" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-tight tabular-nums">
        {prefix}<span className="text-mpj-gold">{value}</span>{suffix}
      </p>
      {(subtext || trend !== undefined) && (
        <div className="mt-2 flex items-center gap-2">
          {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
          {trend !== undefined && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              trend > 0 ? 'text-green-700 bg-green-50' :
              trend < 0 ? 'text-red-600 bg-red-50' :
              'text-gray-500 bg-gray-100'
            }`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
