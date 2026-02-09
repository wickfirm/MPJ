'use client'
import { useState } from 'react'
import { ImageIcon, X } from 'lucide-react'

export default function CreativeThumb({ creative, size = 40 }) {
  const [showPreview, setShowPreview] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!creative || imgError) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-md border border-gray-200"
        style={{ width: size, height: size }}
        title="No creative uploaded"
      >
        <ImageIcon size={16} className="text-gray-300" />
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowPreview(true)}
        className="relative group rounded-md overflow-hidden border border-gray-200 hover:border-mpj-purple transition-colors flex-shrink-0"
        style={{ width: size, height: size }}
        title={`View: ${creative.ad_name}`}
      >
        <img
          src={creative.image_url}
          alt={creative.ad_name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </button>

      {/* Lightbox Preview */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fade-in"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 z-10 transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={creative.image_url}
              alt={creative.ad_name}
              className="max-w-full max-h-[75vh] object-contain"
            />
            <div className="px-4 py-3 bg-gray-50 border-t">
              <p className="text-sm font-medium text-gray-800 truncate">{creative.ad_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {creative.month} {creative.notes ? `\u2022 ${creative.notes}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
