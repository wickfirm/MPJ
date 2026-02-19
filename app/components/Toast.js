'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const config = {
  success: {
    icon: CheckCircle,
    bg: 'from-green-500 to-green-600',
    progress: 'bg-white/40',
  },
  error: {
    icon: AlertCircle,
    bg: 'from-red-500 to-red-600',
    progress: 'bg-white/40',
  },
  info: {
    icon: Info,
    bg: 'from-blue-500 to-blue-600',
    progress: 'bg-white/40',
  },
}

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const { icon: Icon, bg, progress: progressColor } = config[type] || config.info

  useEffect(() => {
    const start = Date.now()
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
    }, 50)

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => { clearTimeout(timer); clearInterval(tick) }
  }, [duration, onClose])

  return (
    <div
      className={`fixed top-5 right-5 z-[200] rounded-2xl shadow-toast text-white text-sm font-medium overflow-hidden transition-all duration-300 ${
        visible ? 'animate-slide-in-right opacity-100' : 'animate-slide-out-right opacity-0'
      }`}
      style={{ minWidth: 280, maxWidth: 380 }}
      role="alert"
    >
      {/* Gradient background */}
      <div className={`bg-gradient-to-br ${bg} px-4 py-3.5 flex items-center gap-3`}>
        <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon size={15} />
        </div>
        <span className="flex-1 leading-snug">{message}</span>
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
          className="w-6 h-6 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Close notification"
        >
          <X size={13} />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-white/10">
        <div
          className={`h-full ${progressColor} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
