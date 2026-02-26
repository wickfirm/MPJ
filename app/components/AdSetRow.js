'use client'
import { useState } from 'react'
import { ChevronRight, Users, Eye, EyeOff, Pencil, Check, X, Plus } from 'lucide-react'
import AudienceTag from './AudienceTag'

const formatInt = (n) => n?.toLocaleString('en-US') || '0'

// ── Inline-editable single field ────────────────────────────────────────────
function EditableField({ value, onSave, placeholder = '' }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')

  const commit = () => { onSave(draft); setEditing(false) }
  const cancel = () => { setDraft(value || ''); setEditing(false) }

  if (editing) {
    return (
      <span className="flex items-center gap-1">
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={placeholder}
          className="border border-yellow-400 rounded px-1.5 py-0.5 text-xs bg-yellow-50 focus:outline-none w-40"
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }}
        />
        <button onClick={commit} className="text-green-600 hover:text-green-800 flex-shrink-0"><Check size={13} /></button>
        <button onClick={cancel} className="text-red-500 hover:text-red-700 flex-shrink-0"><X size={13} /></button>
      </span>
    )
  }

  return (
    <span
      className="group flex items-center gap-1 cursor-pointer"
      onClick={() => { setDraft(value || ''); setEditing(true) }}
    >
      <span className={!value ? 'text-gray-400 italic text-xs' : 'text-gray-700'}>{value || (placeholder || '—')}</span>
      <Pencil size={11} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </span>
  )
}

// ── Editable tag list (add / remove) ────────────────────────────────────────
function EditableTagList({ items = [], onSave, color }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState([...items])
  const [newTag, setNewTag] = useState('')

  const commit = () => { onSave(draft); setEditing(false) }
  const cancel = () => { setDraft([...items]); setNewTag(''); setEditing(false) }
  const removeTag = (idx) => setDraft(draft.filter((_, i) => i !== idx))
  const addTag = () => {
    const t = newTag.trim()
    if (t && !draft.includes(t)) setDraft([...draft, t])
    setNewTag('')
  }

  if (editing) {
    return (
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1">
          {draft.map((tag, idx) => (
            <span key={idx} style={{ backgroundColor: color }} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-gray-700">
              {tag}
              <button onClick={() => removeTag(idx)} className="text-gray-500 hover:text-red-600 leading-none"><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="Add tag…"
            className="border border-yellow-400 rounded px-1.5 py-0.5 text-xs bg-yellow-50 focus:outline-none w-28"
            onKeyDown={e => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') cancel() }}
          />
          <button onClick={addTag} className="text-green-600 hover:text-green-800"><Plus size={13} /></button>
          <button onClick={commit} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1">Save</button>
          <button onClick={cancel} className="text-red-500 hover:text-red-700 text-xs px-1">Cancel</button>
        </div>
      </div>
    )
  }

  if (!items?.length) {
    return (
      <button
        onClick={() => { setDraft([]); setEditing(true) }}
        className="text-xs text-gray-400 italic hover:text-gray-600 flex items-center gap-1"
      >
        <Plus size={11} /> Add
      </button>
    )
  }

  return (
    <div
      className="group flex items-start gap-1 cursor-pointer"
      onClick={() => { setDraft([...items]); setEditing(true) }}
    >
      <div className="flex-1"><AudienceTag items={items} color={color} /></div>
      <Pencil size={11} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
    </div>
  )
}

// ── Main AdSetRow ────────────────────────────────────────────────────────────
export default function AdSetRow({ adSet, isExpanded, onToggle, userRole, onToggleHidden, onAudienceEdit }) {
  const isAdmin  = userRole === 'admin'
  const isHidden = !!adSet.hidden
  // admin col (eye) + name + impressions + clicks + ctr + linkClicks + engagement = 7 admin / 6 client
  const totalCols = isAdmin ? 7 : 6

  const saveAudience = (field, value) => { if (onAudienceEdit) onAudienceEdit(field, value) }

  return (
    <>
      <tr className={`border-t transition-colors hover:bg-gray-50/50 ${isHidden && isAdmin ? 'opacity-40' : ''}`}>

        {/* Admin eye-toggle (first column, matches table header) */}
        {isAdmin && (
          <td className="px-2 py-2.5">
            <button
              onClick={() => onToggleHidden && onToggleHidden()}
              title={isHidden ? 'Show to client' : 'Hide from client'}
              className="text-gray-300 hover:text-mpj-charcoal transition-colors cursor-pointer"
            >
              {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </td>
        )}

        {/* Name + expand chevron */}
        <td className="px-3 py-2.5">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 font-medium hover:text-mpj-charcoal transition-colors cursor-pointer"
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} audience for ${adSet.name}`}
          >
            <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
              <ChevronRight size={14} />
            </span>
            <span className="truncate max-w-[200px] md:max-w-none">{adSet.name}</span>
          </button>
        </td>

        <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(adSet.impressions)}</td>
        <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(adSet.clicks)}</td>
        <td className="px-3 py-2.5 text-right tabular-nums">{adSet.ctr ?? '—'}</td>
        <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(adSet.linkClicks)}</td>
        <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(adSet.engagement)}</td>
      </tr>

      {/* ── Expanded audience panel ── */}
      {isExpanded && (
        <tr className="bg-gray-50/80 animate-fade-in">
          <td colSpan={totalCols} className="px-6 py-4">
            {adSet.audience ? (
              <div className="grid md:grid-cols-2 gap-4 text-sm">

                {/* ── Left column ── */}
                <div className="space-y-3">

                  {/* Location */}
                  <div>
                    <p className="font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5">
                      <Users size={14} className="text-mpj-charcoal" /> Location
                      {adSet.audience.type && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          adSet.audience.type === 'Advantage+' ? 'bg-blue-100 text-blue-700'
                          : adSet.audience.type === 'Custom'   ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}>
                          {adSet.audience.type}
                        </span>
                      )}
                    </p>
                    {isAdmin ? (
                      <EditableField
                        value={adSet.audience.location}
                        placeholder="e.g. Beirut, Lebanon"
                        onSave={v => saveAudience('location', v)}
                      />
                    ) : (
                      <p className="text-gray-600">{adSet.audience.location || '—'}</p>
                    )}
                  </div>

                  {/* Demographics */}
                  <div>
                    <p className="font-semibold text-gray-700 mb-1.5">Demographics</p>
                    {isAdmin ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-12 flex-shrink-0">Age:</span>
                          <EditableField
                            value={adSet.audience.age}
                            placeholder="e.g. 25–45"
                            onSave={v => saveAudience('age', v)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-12 flex-shrink-0">Gender:</span>
                          <EditableField
                            value={adSet.audience.gender}
                            placeholder="e.g. All"
                            onSave={v => saveAudience('gender', v)}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Age: {adSet.audience.age || '—'} | Gender: {adSet.audience.gender || '—'}
                      </p>
                    )}
                    {adSet.audience.demographics?.length > 0 && (
                      <div className="mt-2"><AudienceTag items={adSet.audience.demographics} color="#E8E2D9" /></div>
                    )}
                  </div>

                </div>

                {/* ── Right column ── */}
                <div className="space-y-3">

                  {/* Custom Audiences */}
                  <div>
                    <p className="font-semibold text-gray-700 mb-1.5">Custom Audiences</p>
                    {isAdmin ? (
                      <EditableTagList
                        items={adSet.audience.customAudiences || []}
                        color="#e9d5ff"
                        onSave={v => saveAudience('customAudiences', v)}
                      />
                    ) : (
                      adSet.audience.customAudiences?.length > 0
                        ? <AudienceTag items={adSet.audience.customAudiences} color="#e9d5ff" />
                        : <p className="text-gray-400 italic text-xs">None</p>
                    )}
                  </div>

                  {/* Interests */}
                  <div>
                    <p className="font-semibold text-gray-700 mb-1.5">Interests</p>
                    {isAdmin ? (
                      <EditableTagList
                        items={adSet.audience.interests || []}
                        color="#FBF7ED"
                        onSave={v => saveAudience('interests', v)}
                      />
                    ) : (
                      adSet.audience.interests?.length > 0
                        ? <AudienceTag items={adSet.audience.interests} color="#FBF7ED" />
                        : <p className="text-gray-400 italic text-xs">None</p>
                    )}
                  </div>

                  {/* Behaviors — show section always for admin, only when non-empty for client */}
                  {(isAdmin || adSet.audience.behaviors?.length > 0) && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1.5">Behaviors</p>
                      {isAdmin ? (
                        <EditableTagList
                          items={adSet.audience.behaviors || []}
                          color="#faf089"
                          onSave={v => saveAudience('behaviors', v)}
                        />
                      ) : (
                        <AudienceTag items={adSet.audience.behaviors} color="#faf089" />
                      )}
                    </div>
                  )}

                  {/* Excluded audiences */}
                  {(isAdmin || adSet.audience.excluded?.length > 0) && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1.5">Excluded</p>
                      {isAdmin ? (
                        <EditableTagList
                          items={adSet.audience.excluded || []}
                          color="#fecaca"
                          onSave={v => saveAudience('excluded', v)}
                        />
                      ) : (
                        adSet.audience.excluded?.length > 0
                          ? <AudienceTag items={adSet.audience.excluded} color="#fecaca" />
                          : null
                      )}
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No audience data — re-sync to pull targeting from Meta.
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  )
}
