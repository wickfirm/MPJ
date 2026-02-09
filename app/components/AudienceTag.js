'use client'

export default function AudienceTag({ items, color }) {
  if (!items || items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="px-2.5 py-1 text-xs font-medium rounded-full border"
          style={{
            backgroundColor: color + '33',
            borderColor: color + '66',
            color: '#374151'
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
