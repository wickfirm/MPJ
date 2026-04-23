'use client'
import { useState, useMemo } from 'react'
import { Trash2, Calendar, X, ChevronDown, Maximize2, Check, Download, Loader2 } from 'lucide-react'
import JSZip from 'jszip'

const sanitizeName = (s) => (s || 'creative').replace(/[\\/:*?"<>|]+/g, '_').trim()

const getExtFromMime = (mime, fallbackUrl = '') => {
  if (mime?.includes('png')) return 'png'
  if (mime?.includes('webp')) return 'webp'
  if (mime?.includes('gif')) return 'gif'
  if (mime?.includes('jpeg') || mime?.includes('jpg')) return 'jpg'
  const m = fallbackUrl.match(/\.(png|jpe?g|webp|gif)(?:\?|$)/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg'
}

const triggerBlobDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const fetchCreativeBlob = async (c) => {
  const res = await fetch(`/api/creatives/download?id=${encodeURIComponent(c.id)}`)
  if (!res.ok) throw new Error('Failed to fetch image')
  return res.blob()
}

const downloadCreative = async (c) => {
  const blob = await fetchCreativeBlob(c)
  const ext = getExtFromMime(c.mime_type || blob.type, c.image_url)
  const name = c.file_name || `${sanitizeName(c.ad_name)}_${c.month || ''}.${ext}`
  triggerBlobDownload(blob, name)
}

export default function CreativeGallery({ creatives = [], onDelete, userRole = 'client', onPublish }) {
  const [filterMonth, setFilterMonth] = useState('all')
  const [previewImage, setPreviewImage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [publishing, setPublishing] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState({ done: 0, total: 0 })
  const [exportPhase, setExportPhase] = useState('idle') // 'idle' | 'fetching' | 'compressing'
  const isAdmin = userRole === 'admin'

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleBulkPublish = async () => {
    if (selected.size === 0) return
    setPublishing(true)
    try {
      await onPublish?.([...selected])
      setSelected(new Set())
    } finally {
      setPublishing(false)
    }
  }

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

  const handleDownloadOne = async (c) => {
    setDownloadingId(c.id)
    try {
      await downloadCreative(c)
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloadingId(null)
    }
  }

  const handleExportAll = async () => {
    if (filtered.length === 0) return
    const CONCURRENCY = 5
    setExporting(true)
    setExportPhase('fetching')
    setExportProgress({ done: 0, total: filtered.length })
    try {
      const zip = new JSZip()
      const usedNames = new Set()
      let done = 0
      let cursor = 0

      const processOne = async (c) => {
        const blob = await fetchCreativeBlob(c)
        const ext = getExtFromMime(c.mime_type || blob.type, c.image_url)
        const monthFolder = c.month || 'unknown-month'
        const base = c.file_name ? c.file_name.replace(/\.[^.]+$/, '') : sanitizeName(c.ad_name)
        let name = `${base}.${ext}`
        let n = 1
        while (usedNames.has(`${monthFolder}/${name}`)) {
          name = `${base}_${n++}.${ext}`
        }
        usedNames.add(`${monthFolder}/${name}`)
        zip.folder(monthFolder).file(name, blob)
      }

      const worker = async () => {
        while (cursor < filtered.length) {
          const c = filtered[cursor++]
          try {
            await processOne(c)
          } catch (e) {
            console.warn('Skipping creative due to fetch error:', c.ad_name, e)
          }
          done += 1
          setExportProgress({ done, total: filtered.length })
        }
      }

      const workerCount = Math.min(CONCURRENCY, filtered.length)
      await Promise.all(Array.from({ length: workerCount }, worker))

      setExportPhase('compressing')
      setExportProgress({ done: 0, total: 100 })
      const zipBlob = await zip.generateAsync({ type: 'blob' }, (meta) => {
        setExportProgress({ done: Math.round(meta.percent), total: 100 })
      })

      const venueTag = filtered[0]?.venues?.name ? sanitizeName(filtered[0].venues.name) + '_' : ''
      const monthTag = filterMonth === 'all' ? 'all-months' : filterMonth
      triggerBlobDownload(zipBlob, `${venueTag}creatives_${monthTag}.zip`)
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setExporting(false)
      setExportPhase('idle')
      setExportProgress({ done: 0, total: 0 })
    }
  }

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

  const draftCount = creatives.filter(c => c.status === 'draft').length

  return (
    <div className="space-y-4">
      {/* Bulk Publish Bar */}
      {isAdmin && draftCount > 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              {draftCount} draft{draftCount !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-amber-700">
              {selected.size > 0 ? `${selected.size} selected` : 'Select drafts to publish or publish all'}
            </span>
          </div>
          <button
            onClick={handleBulkPublish}
            disabled={publishing || selected.size === 0}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-40 transition-colors"
          >
            {publishing ? 'Publishing...' : `Publish ${selected.size > 0 ? 'Selected' : 'All'}`}
          </button>
        </div>
      )}

      {/* Filter + Export Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {months.length > 1 ? (
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
        ) : <div />}
        <button
          onClick={handleExportAll}
          disabled={exporting || filtered.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-mpj-charcoal hover:bg-mpj-charcoal/90 text-white disabled:opacity-40 transition-colors"
          title="Download all visible creatives as a ZIP"
        >
          {exporting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {exportPhase === 'compressing'
                ? `Compressing ${exportProgress.done}%`
                : `Zipping ${exportProgress.done}/${exportProgress.total}`}
            </>
          ) : (
            <>
              <Download size={14} />
              Export All ({filtered.length})
            </>
          )}
        </button>
      </div>

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
                  {/* Draft badge */}
                  {isAdmin && c.status === 'draft' && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-400 text-amber-900 shadow-sm">
                      Draft
                    </span>
                  )}
                  {/* Meta source badge */}
                  {isAdmin && c.source === 'meta' && (
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[9px] font-medium rounded bg-blue-500 text-white shadow-sm">
                      META
                    </span>
                  )}
                  {/* Select checkbox for drafts */}
                  {isAdmin && c.status === 'draft' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelect(c.id) }}
                      className={`absolute top-2 right-8 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selected.has(c.id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white/80 border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {selected.has(c.id) && <Check size={12} />}
                    </button>
                  )}
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

                {/* Download button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownloadOne(c) }}
                  disabled={downloadingId === c.id}
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-mpj-charcoal hover:bg-mpj-charcoal/90 text-white rounded-full p-1 shadow-md transition-all disabled:opacity-60"
                  title="Download image"
                >
                  {downloadingId === c.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                </button>

                {/* Delete button (admin only) */}
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(c.id) }}
                    className="absolute top-2 right-9 z-10 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-all"
                    title="Delete creative"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
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
            <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{previewImage.ad_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatMonth(previewImage.month)}
                  {previewImage.notes ? ` \u2022 ${previewImage.notes}` : ''}
                </p>
              </div>
              <button
                onClick={() => handleDownloadOne(previewImage)}
                disabled={downloadingId === previewImage.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-mpj-charcoal hover:bg-mpj-charcoal/90 text-white disabled:opacity-60 flex-shrink-0"
              >
                {downloadingId === previewImage.id
                  ? <><Loader2 size={14} className="animate-spin" /> Downloading</>
                  : <><Download size={14} /> Download</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
