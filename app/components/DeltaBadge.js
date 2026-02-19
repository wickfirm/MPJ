'use client'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function DeltaBadge({ current, previous, isPercent = false }) {
  if (!previous || !current) return <span className="text-gray-300 text-xs">—</span>

  const diff = current - previous
  const pct = ((diff / previous) * 100).toFixed(1)
  const isPositive = diff > 0
  const isNeutral = diff === 0

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
        isNeutral
          ? 'text-gray-500 bg-gray-50 border-gray-200'
          : isPositive
            ? 'text-green-700 bg-green-50 border-green-100'
            : 'text-red-600 bg-red-50 border-red-100'
      }`}
      aria-label={`${isPositive ? 'Increased' : isNeutral ? 'No change' : 'Decreased'} by ${Math.abs(pct)}%`}
    >
      {isNeutral
        ? <Minus size={11} />
        : isPositive
          ? <TrendingUp size={11} />
          : <TrendingDown size={11} />
      }
      {isPercent
        ? `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`
        : `${diff > 0 ? '+' : ''}${pct}%`
      }
    </span>
  )
}
