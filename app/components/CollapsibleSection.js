'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export default function CollapsibleSection({ title, children, defaultOpen = true, color = '#76527c', icon: Icon }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 animate-fade-in overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-white font-semibold transition-colors duration-200 cursor-pointer"
        style={{ backgroundColor: color }}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon size={18} />}
          {title}
        </span>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={20} />
        </span>
      </button>
      <div
        className={`transition-all duration-200 ease-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  )
}
