'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Check, Plus, Trash2 } from 'lucide-react'

export default function CreativeUpload({ venues, weeklyReports, onSuccess, onClose }) {
  const [selectedVenue, setSelectedVenue] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [adName, setAdName] = useState('')
  const [customAdName, setCustomAdName] = useState('')
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState([]) // { file, preview }[]
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0) // how many uploaded so far
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
      const startDate = weekKey.split('_')[0]
      if (startDate) months.add(startDate.substring(0, 7))
    })
    return Array.from(months).sort().reverse()
  })()

  // Extract ad names from weekly reports for the selected venue + month
  const availableAdNames = (() => {
    if (!selectedVenue || !selectedMonth || !weeklyReports[selectedVenue]) return []
    const names = new Set()
    Object.entries(weeklyReports[selectedVenue]).forEach(([weekKey, report]) => {
      const startDate = weekKey.split('_')[0]
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

  const validateFile = (f) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(f.type)) return 'Only JPG, PNG, WebP, and GIF images are allowed'
    if (f.size > 10 * 1024 * 1024) return 'File must be under 10MB'
    return null
  }

  const addFiles = useCallback((newFiles) => {
    const toAdd = []
    for (const f of newFiles) {
      const err = validateFile(f)
      if (err) {
        setError(err)
        continue
      }
      toAdd.push(f)
    }
    if (toAdd.length === 0) return

    setError(null)

    // Generate previews for each file
    toAdd.forEach(f => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFiles(prev => [...prev, { file: f, preview: e.target.result }])
      }
      reader.readAsDataURL(f)
    })
  }, [])

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const dropped = Array.from(e.dataTransfer?.files || [])
    if (dropped.length > 0) addFiles(dropped)
  }, [addFiles])

  // Clipboard paste support — works anywhere in the modal
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items
    if (!items) return
    const imageFiles = []
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const f = item.getAsFile()
        if (f) {
          const ext = f.type.split('/')[1] || 'png'
          const renamed = new File([f], `pasted-creative-${Date.now()}.${ext}`, { type: f.type })
          imageFiles.push(renamed)
        }
      }
    }
    if (imageFiles.length > 0) addFiles(imageFiles)
  }, [addFiles])

  const handleUpload = async () => {
    const finalAdName = adName === '__custom__' ? customAdName.trim() : adName
    if (files.length === 0 || !selectedVenue || !selectedMonth || !finalAdName) {
      setError('Please fill in all required fields and add at least one image')
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    const uploaded = []
    const errors = []

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(i + 1)
      try {
        const formData = new FormData()
        formData.append('file', files[i].file)
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
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        uploaded.push(data.creative)
      } catch (err) {
        errors.push(`${files[i].file.name}: ${err.message}`)
      }
    }

    if (uploaded.length > 0) {
      // Notify parent of each uploaded creative
      uploaded.forEach(c => onSuccess?.(c))
    }

    if (errors.length > 0) {
      setError(`${errors.length} upload(s) failed: ${errors.join('; ')}`)
      // Remove successfully uploaded files, keep failed ones
      setFiles(prev => prev.filter((_, i) => i >= uploaded.length))
    } else {
      // All done — close modal
      setFiles([])
    }

    setUploading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[90] p-4 animate-fade-in" onPaste={handlePaste}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-mpj-charcoal" />
            <h3 className="text-lg font-semibold text-gray-800">Upload Creatives</h3>
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
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold outline-none"
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
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold outline-none"
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
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold outline-none"
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
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold outline-none"
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
                className="w-full border rounded-lg px-3 py-2 text-sm mt-2 focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold outline-none"
              />
            )}
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Creative Images * <span className="text-gray-400 font-normal">({files.length} selected)</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
                ${dragActive ? 'border-mpj-gold bg-mpj-gold-xlight' : 'border-gray-300 hover:border-mpj-gold/50 hover:bg-gray-50'}
                ${files.length > 0 ? 'border-green-400/60' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(e) => {
                  const selected = Array.from(e.target.files || [])
                  if (selected.length > 0) addFiles(selected)
                  e.target.value = '' // reset so same file can be re-selected
                }}
                className="hidden"
              />

              <div className="space-y-2">
                {files.length > 0 ? (
                  <Plus size={28} className="mx-auto text-mpj-charcoal" />
                ) : (
                  <ImageIcon size={32} className="mx-auto text-gray-400" />
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-mpj-charcoal">Click to upload</span>, drag and drop, or <span className="font-medium text-mpj-charcoal">Ctrl+V</span> to paste
                </p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP, GIF (max 10MB each) — multiple files supported</p>
              </div>
            </div>
          </div>

          {/* Image Previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={f.preview} alt={f.file.name} className="w-full aspect-square object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5">
                    <p className="text-[9px] text-white truncate">{f.file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Valentine's campaign, Arabic version..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && files.length > 1 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Uploading {uploadProgress} of {files.length}...</span>
                <span>{Math.round((uploadProgress / files.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-mpj-gold h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadProgress / files.length) * 100}%` }}
                />
              </div>
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
              disabled={uploading || files.length === 0 || !selectedVenue || !selectedMonth || (!adName || (adName === '__custom__' && !customAdName.trim()))}
              className={`
                flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2
                ${uploading ? 'bg-mpj-charcoal/60 cursor-wait' : 'bg-mpj-charcoal hover:bg-mpj-charcoal-light'}
                disabled:opacity-40 disabled:cursor-not-allowed
              `}
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading {uploadProgress}/{files.length}...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload {files.length > 1 ? `${files.length} Images` : 'Image'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
