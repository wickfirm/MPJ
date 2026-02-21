'use client'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message = 'Something went wrong while loading data.', onRetry }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md mx-auto p-8">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load data</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-mpj-charcoal text-white rounded-lg text-sm font-medium hover:bg-mpj-charcoal-light transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
