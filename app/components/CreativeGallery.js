'use client'
import { useState, useMemo } from 'react'
import { Trash2, Calendar, X, ChevronDown, Maximize2 } from 'lucide-react'

export default function CreativeGallery({ creatives = [], onDelete }) {
  const [filterMonth, setFilterMonth] = useState('all')
  const [previewImage, setPreviewImage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Get unique months
  const months = useMemo(() => {
    const m = [...new Set(creatives.map(c => c.month))].sort().reverse()
    return m
  }, [creatives])

  // Filter creatives
  const filtered = useMemo(() => {
    if (filterMonth === 'all') return creatives
    return creatives.filter(c => c.month === filterMonth)
  }, [creatives, filterMonth])

  // Group by month
  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(c => {
      if (!groups[c.month]) groups[c.month] = []
      groups[c.month].push(c)
    })
    // Sort months descending
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      const res = await fetch('/api/creatives/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onDelete?.(id)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  const formatMonth = (m) => {
    const [year, month] = m.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }

  if (creatives.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm">No creatives uploaded for this venue yet.</p>
        <p className="text-xs mt-1">Use the Upload button to add ad creative images.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Month Filter */}
      {months.length > 1 && (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterMonth('all')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                filterMonth === 'all'
                  ? 'bg-mpj-charcoal text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {months.map(m => (
              <button
                key={m}
                onClick={() => setFilterMonth(m)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  filterMonth === m
                    ? 'bg-mpj-charcoal text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {formatMonth(m)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grouped Gallery */}
      {grouped.map(([month, items]) => (
        <div key={month}>
          <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <span className="bg-mpj-warm text-mpj-charcoal px-2.5 py-0.5 rounded-full text-xs">
              {formatMonth(month)}
            </span>
            <span className="text-xs font-normal text-gray-400">{items.length} creative{items.length !== 1 ? 's' : ''}</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(c => (
              <div
                key={c.id}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-mpj-gold/40 hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img
                    src={c.image_url}
                    alt={c.ad_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => setPreviewImage(c)}
                      className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-full p-2 shadow-lg transition-opacity hover:bg-white"
                    >
                      <Maximize2 size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <p className="text-xs font-medium text-gray-800 truncate" title={c.ad_name}>
                    {c.ad_name}
                  </p>
                  {c.notes && (
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{c.notes}</p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(c.id) }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-all"
                  title="Delete creative"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[95] animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h4 className="font-semibold text-gray-800 mb-2">Delete Creative?</h4>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently remove the image from storage. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 z-10"
            >
              <X size={18} />
            </button>
            <img
              src={previewImage.image_url}
              alt={previewImage.ad_name}
              className="max-w-full max-h-[75vh] object-contain"
            />
            <div className="px-4 py-3 bg-gray-50 border-t">
              <p className="text-sm font-medium text-gray-800">{previewImage.ad_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatMonth(previewImage.month)}
                {previewImage.notes ? ` \u2022 ${previewImage.notes}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
