'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react'

export default function CreativeUpload({ venues, weeklyReports, onSuccess, onClose }) {
  const [selectedVenue, setSelectedVenue] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [adName, setAdName] = useState('')
  const [customAdName, setCustomAdName] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Get venue object from name
  const venueObj = venues.find(v => v.name === selectedVenue)

  // Extract available months from weekly reports for the selected venue
  const availableMonths = (() => {
    if (!selectedVenue || !weeklyReports[selectedVenue]) return []
    const months = new Set()
    Object.keys(weeklyReports[selectedVenue]).forEach(weekKey => {
      // weekKey format: 'YYYY-MM-DD → YYYY-MM-DD'
      const startDate = weekKey.split(' → ')[0]
      if (startDate) months.add(startDate.substring(0, 7)) // '2026-02'
    })
    return Array.from(months).sort().reverse()
  })()

  // Extract ad names from weekly reports for the selected venue + month
  const availableAdNames = (() => {
    if (!selectedVenue || !selectedMonth || !weeklyReports[selectedVenue]) return []
    const names = new Set()
    Object.entries(weeklyReports[selectedVenue]).forEach(([weekKey, report]) => {
      const startDate = weekKey.split(' → ')[0]
      if (startDate && startDate.startsWith(selectedMonth)) {
        const meta = report?.meta_data
        if (meta?.ads) {
          meta.ads.forEach(ad => names.add(ad.name))
        }
        if (meta?.campaigns) {
          meta.campaigns.forEach(c => names.add(c.name))
        }
      }
    })
    return Array.from(names).sort()
  })()

  const handleFile = useCallback((f) => {
    if (!f) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG, WebP, and GIF images are allowed')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB')
      return
    }
    setFile(f)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleUpload = async () => {
    const finalAdName = adName === '__custom__' ? customAdName.trim() : adName
    if (!file || !selectedVenue || !selectedMonth || !finalAdName) {
      setError('Please fill in all required fields')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('venue_id', venueObj.id)
      formData.append('venue_name', selectedVenue)
      formData.append('ad_name', finalAdName)
      formData.append('month', selectedMonth)
      if (notes.trim()) formData.append('notes', notes.trim())

      const res = await fetch('/api/creatives/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onSuccess?.(data.creative)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[90] p-4 animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-mpj-purple" />
            <h3 className="text-lg font-semibold text-gray-800">Upload Creative</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Venue Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
            <select
              value={selectedVenue}
              onChange={(e) => { setSelectedVenue(e.target.value); setSelectedMonth(''); setAdName('') }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple outline-none"
            >
              <option value="">Select venue...</option>
              {venues.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
            {availableMonths.length > 0 ? (
              <select
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(e.target.value); setAdName('') }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple outline-none"
              >
                <option value="">Select month...</option>
                {availableMonths.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            ) : (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple outline-none"
                placeholder="2026-02"
              />
            )}
          </div>

          {/* Ad Name Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad / Campaign Name *</label>
            <select
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple outline-none"
            >
              <option value="">Select ad name...</option>
              {availableAdNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
              <option value="__custom__">+ Custom name...</option>
            </select>
            {adName === '__custom__' && (
              <input
                type="text"
                value={customAdName}
                onChange={(e) => setCustomAdName(e.target.value)}
                placeholder="Enter custom ad name..."
                className="w-full border rounded-lg px-3 py-2 text-sm mt-2 focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple outline-none"
              />
            )}
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Creative Image *</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${dragActive ? 'border-mpj-purple bg-mpj-purple/5' : 'border-gray-300 hover:border-mpj-purple/50 hover:bg-gray-50'}
                ${preview ? 'border-mpj-green' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />

              {preview ? (
                <div className="space-y-3">
                  <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg shadow-sm" />
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <Check size={16} />
                    <span>{file?.name} ({(file?.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null) }}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon size={32} className="mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-mpj-purple">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG, WebP, GIF (max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Valentine's campaign, Arabic version..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !file || !selectedVenue || !selectedMonth || (!adName || (adName === '__custom__' && !customAdName.trim()))}
              className={`
                flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2
                ${uploading ? 'bg-mpj-purple/70 cursor-wait' : 'bg-mpj-purple hover:bg-mpj-purple-dark'}
                disabled:opacity-40 disabled:cursor-not-allowed
              `}
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
