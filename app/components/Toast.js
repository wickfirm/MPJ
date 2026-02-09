'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-green-600',
  error: 'bg-red-500',
  info: 'bg-blue-600',
}

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true)
  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${
        visible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-2'
      } ${colors[type]}`}
      role="alert"
    >
      <Icon size={18} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity cursor-pointer" aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  )
}
