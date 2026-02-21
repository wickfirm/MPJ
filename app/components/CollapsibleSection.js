'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CollapsibleSection({ title, children, defaultOpen = true, color = '#1C1917', icon: Icon }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 mb-4 overflow-hidden animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-white font-semibold transition-all duration-200 cursor-pointer group"
        style={{
          background: `linear-gradient(135deg, ${color}ee 0%, ${color} 60%, ${color}cc 100%)`,
        }}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
      >
        <span className="flex items-center gap-2.5 text-sm">
          {Icon && (
            <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon size={14} />
            </span>
          )}
          {title}
        </span>
        <span className={`w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:bg-white/25 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={15} />
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-smooth ${isOpen ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  )
}
