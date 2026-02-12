'use client'
import { ChevronDown, ChevronRight, Users } from 'lucide-react'
import AudienceTag from './AudienceTag'

const formatInt = (n) => n?.toLocaleString('en-US') || '0'

export default function AdSetRow({ adSet, isExpanded, onToggle }) {
  return (
    <>
      <tr className="border-t hover:bg-gray-50 transition-colors">
        <td className="px-3 py-2.5">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 font-medium hover:text-mpj-purple transition-colors cursor-pointer"
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
        <td className="px-3 py-2.5 text-right tabular-nums">{adSet.ctr}</td>
        <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(adSet.linkClicks)}</td>
        <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(adSet.engagement)}</td>
      </tr>
      {isExpanded && adSet.audience && (
        <tr className="bg-gray-50/80 animate-fade-in">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Users size={14} className="text-mpj-purple" /> Location
                    {adSet.audience.type && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${adSet.audience.type === 'Advantage+' ? 'bg-blue-100 text-blue-700' : adSet.audience.type === 'Custom' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{adSet.audience.type}</span>
                    )}
                  </p>
                  <p className="text-gray-600">{adSet.audience.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1.5">Demographics</p>
                  <p className="text-gray-600">Age: {adSet.audience.age} | Gender: {adSet.audience.gender}</p>
                  {adSet.audience.demographics?.length > 0 && (
                    <div className="mt-2"><AudienceTag items={adSet.audience.demographics} color="#D0E4E7" /></div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {adSet.audience.customAudiences?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1.5">Custom Audiences</p>
                    <AudienceTag items={adSet.audience.customAudiences} color="#e9d5ff" />
                  </div>
                )}
                {adSet.audience.interests?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1.5">Interests</p>
                    <AudienceTag items={adSet.audience.interests} color="#d8ee91" />
                  </div>
                )}
                {adSet.audience.behaviors?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1.5">Behaviors</p>
                    <AudienceTag items={adSet.audience.behaviors} color="#faf089" />
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
