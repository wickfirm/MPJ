'use client'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

export default function DeltaBadge({ current, previous, isPercent = false }) {
  if (!previous || !current) return <span className="text-gray-400 text-sm">--</span>

  const diff = current - previous
  const pct = ((diff / previous) * 100).toFixed(1)
  const isPositive = diff > 0
  const isNeutral = diff === 0

  const colorClass = isNeutral
    ? 'text-gray-500 bg-gray-100'
    : isPositive
      ? 'text-green-700 bg-green-50'
      : 'text-red-700 bg-red-50'

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}
      aria-label={`${isPositive ? 'Increased' : isNeutral ? 'No change' : 'Decreased'} by ${Math.abs(pct)}%`}
    >
      {isNeutral ? <Minus size={12} /> : isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {isPercent
        ? `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`
        : `${diff > 0 ? '+' : ''}${pct}%`
      }
    </span>
  )
}
