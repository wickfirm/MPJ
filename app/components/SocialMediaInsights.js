'use client'
import { useState, useMemo } from 'react'
import { Users, Eye, TrendingUp, Heart, MessageCircle, Share2, Bookmark, Film, Image as ImageIcon, Calendar, Instagram, Facebook, ArrowUpRight, ArrowDownRight, Minus, Hash } from 'lucide-react'

const formatNum = (n) => n?.toLocaleString('en-US') || '0'
const formatK = (n) => {
  if (!n) return '0'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function GrowthBadge({ value }) {
  if (value === null || value === undefined) return null
  const isPositive = value > 0
  const isNeutral = value === 0
  const colorClass = isNeutral
    ? 'text-gray-500 bg-gray-100'
    : isPositive
      ? 'text-green-700 bg-green-50'
      : 'text-red-700 bg-red-50'

  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colorClass}`}>
      {isNeutral ? <Minus size={10} /> : isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      {value > 0 ? '+' : ''}{Number(value).toFixed(2)}%
    </span>
  )
}

function MiniKPI({ label, value, icon: Icon, growth, suffix = '' }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className="w-6 h-6 rounded-md bg-pink-50 flex items-center justify-center">
            <Icon size={12} className="text-pink-500" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-bold text-gray-800 leading-tight">{value}{suffix}</p>
        {growth !== undefined && growth !== null && <GrowthBadge value={growth} />}
      </div>
    </div>
  )
}

function PercentBar({ label, value, maxValue }) {
  const width = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-[45%] text-gray-700 truncate text-right" title={label}>{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
          style={{ width: `${Math.min(width, 100)}%` }}
        />
      </div>
      <span className="w-12 text-gray-500 tabular-nums">{Number(value).toFixed(1)}%</span>
    </div>
  )
}

export default function SocialMediaInsights({ data, allData = [], venueName }) {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [activeSection, setActiveSection] = useState('instagram') // 'instagram' or 'facebook'

  // Get all available months for this venue
  const months = useMemo(() => {
    const m = allData
      .filter(d => d.venues?.name === venueName)
      .map(d => d.month)
      .sort()
      .reverse()
    return [...new Set(m)]
  }, [allData, venueName])

  // Current data — either selected month or latest
  const currentData = useMemo(() => {
    if (selectedMonth) {
      return allData.find(d => d.venues?.name === venueName && d.month === selectedMonth)
    }
    return allData.find(d => d.venues?.name === venueName)
  }, [allData, venueName, selectedMonth])

  const formatMonth = (m) => {
    if (!m) return ''
    const [year, month] = m.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }

  if (!currentData) {
    return (
      <div className="text-center py-10 text-gray-400">
        <Instagram size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No social media data available for this venue.</p>
        <p className="text-xs mt-1">Upload a Metricool report to populate this section.</p>
      </div>
    )
  }

  const d = currentData
  const topPosts = d.ig_top_posts || []
  const topReels = d.ig_top_reels || []
  const demographics = d.ig_demographics || {}
  const hashtags = d.ig_hashtags || []
  const sponsored = d.ig_sponsored || []

  const fbTopPosts = d.fb_top_posts || []
  const fbDemographics = d.fb_demographics || {}

  const maxCountryPct = demographics.countries?.length > 0 ? demographics.countries[0].pct : 100
  const maxCityPct = demographics.cities?.length > 0 ? demographics.cities[0].pct : 100

  return (
    <div className="space-y-5">
      {/* Month Selector */}
      {months.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar size={14} className="text-gray-400" />
          {months.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                (selectedMonth || months[0]) === m
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {formatMonth(m)}
            </button>
          ))}
        </div>
      )}

      {/* Platform Toggle */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 w-fit">
        <button
          onClick={() => setActiveSection('instagram')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeSection === 'instagram'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Instagram size={14} /> Instagram
        </button>
        <button
          onClick={() => setActiveSection('facebook')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeSection === 'facebook'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Facebook size={14} /> Facebook
        </button>
      </div>

      {/* ─── INSTAGRAM ─── */}
      {activeSection === 'instagram' && (
        <div className="space-y-5 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <MiniKPI label="Followers" value={formatNum(d.ig_followers)} icon={Users} growth={d.ig_followers_growth} />
            <MiniKPI label="Impressions" value={formatK(d.ig_impressions)} icon={Eye} />
            <MiniKPI label="Avg Reach/Day" value={formatK(d.ig_avg_reach_per_day)} icon={TrendingUp} />
            <MiniKPI label="Engagement" value={d.ig_engagement_rate} icon={Heart} suffix="%" />
            <MiniKPI label="Interactions" value={formatNum(d.ig_total_interactions)} icon={MessageCircle} />
            <MiniKPI label="Content" value={(d.ig_posts_count || 0) + (d.ig_reels_count || 0) + (d.ig_stories_count || 0)} icon={ImageIcon} />
          </div>

          {/* Content Breakdown */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-purple-50/50 rounded-lg p-2.5 text-center">
              <ImageIcon size={16} className="mx-auto text-purple-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">{d.ig_posts_count || 0}</p>
              <p className="text-[10px] text-gray-500">Posts</p>
            </div>
            <div className="bg-pink-50/50 rounded-lg p-2.5 text-center">
              <Film size={16} className="mx-auto text-pink-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">{d.ig_reels_count || 0}</p>
              <p className="text-[10px] text-gray-500">Reels</p>
            </div>
            <div className="bg-blue-50/50 rounded-lg p-2.5 text-center">
              <div className="w-4 h-4 mx-auto mb-1 rounded-full border-2 border-blue-400 border-dashed" />
              <p className="text-lg font-bold text-gray-800">{d.ig_stories_count || 0}</p>
              <p className="text-[10px] text-gray-500">Stories</p>
            </div>
          </div>

          {/* Interaction Breakdown */}
          <div className="grid grid-cols-4 gap-2">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
              <Heart size={14} className="text-red-400" />
              <div>
                <p className="text-sm font-bold text-gray-800">{formatNum(d.ig_likes)}</p>
                <p className="text-[9px] text-gray-400">Likes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
              <MessageCircle size={14} className="text-blue-400" />
              <div>
                <p className="text-sm font-bold text-gray-800">{formatNum(d.ig_comments)}</p>
                <p className="text-[9px] text-gray-400">Comments</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
              <Share2 size={14} className="text-green-400" />
              <div>
                <p className="text-sm font-bold text-gray-800">{formatNum(d.ig_shares)}</p>
                <p className="text-[9px] text-gray-400">Shares</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
              <Bookmark size={14} className="text-yellow-500" />
              <div>
                <p className="text-sm font-bold text-gray-800">{formatNum(d.ig_saves)}</p>
                <p className="text-[9px] text-gray-400">Saves</p>
              </div>
            </div>
          </div>

          {/* Top Posts */}
          {topPosts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon size={14} className="text-pink-500" />
                Top Posts <span className="text-xs font-normal text-gray-400">by reach</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Post</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Views</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Reach</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Likes</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600 hidden sm:table-cell">Comments</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600 hidden sm:table-cell">Saves</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Eng%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPosts.slice(0, 10).map((p, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.published}</td>
                        <td className="px-3 py-2 text-gray-800 max-w-[200px] truncate" title={p.title}>{p.title}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatNum(p.views)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium">{formatNum(p.reach)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatNum(p.likes)}</td>
                        <td className="px-3 py-2 text-right tabular-nums hidden sm:table-cell">{formatNum(p.comments)}</td>
                        <td className="px-3 py-2 text-right tabular-nums hidden sm:table-cell">{formatNum(p.saved)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium text-pink-600">{p.engagement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Reels */}
          {topReels.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Film size={14} className="text-pink-500" />
                Top Reels <span className="text-xs font-normal text-gray-400">by reach</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Reel</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Views</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Reach</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Likes</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600 hidden sm:table-cell">Shares</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Eng%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topReels.map((r, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{r.published}</td>
                        <td className="px-3 py-2 text-gray-800 max-w-[200px] truncate" title={r.title}>{r.title}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatNum(r.views)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium">{formatNum(r.reach)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatNum(r.likes)}</td>
                        <td className="px-3 py-2 text-right tabular-nums hidden sm:table-cell">{formatNum(r.shares)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium text-pink-600">{r.engagement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sponsored Posts */}
          {sponsored.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <TrendingUp size={14} className="text-purple-500" />
                Promoted Content
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Post</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Reach</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Views</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Interactions</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsored.map((s, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{s.published}</td>
                        <td className="px-3 py-2 text-gray-800 max-w-[200px] truncate" title={s.title}>{s.title}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatK(s.reach)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatK(s.views)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatNum(s.interactions)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium text-purple-600">${Number(s.spent).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Demographics */}
          {(demographics.countries?.length > 0 || demographics.cities?.length > 0) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users size={14} className="text-purple-500" />
                Audience Demographics
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {demographics.countries?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Top Countries</p>
                    <div className="space-y-2">
                      {demographics.countries.slice(0, 7).map((c, i) => (
                        <PercentBar key={i} label={c.name} value={c.pct} maxValue={maxCountryPct} />
                      ))}
                    </div>
                  </div>
                )}
                {demographics.cities?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Top Cities</p>
                    <div className="space-y-2">
                      {demographics.cities.slice(0, 7).map((c, i) => (
                        <PercentBar key={i} label={c.name} value={c.pct} maxValue={maxCityPct} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top Hashtags */}
          {hashtags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Hash size={14} className="text-blue-500" />
                Top Hashtags <span className="text-xs font-normal text-gray-400">by views</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {hashtags.slice(0, 15).map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
                    title={`${h.posts} posts · ${formatNum(h.views)} views · ${formatNum(h.likes)} likes`}
                  >
                    {h.tag}
                    <span className="text-blue-400 text-[10px]">{formatK(h.views)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── FACEBOOK ─── */}
      {activeSection === 'facebook' && (
        <div className="space-y-5 animate-fade-in">
          {/* FB KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <MiniKPI label="Followers" value={formatNum(d.fb_followers)} icon={Users} growth={d.fb_followers_growth} />
            <MiniKPI label="Page Views" value={formatNum(d.fb_page_views)} icon={Eye} />
            <MiniKPI label="Impressions" value={formatK(d.fb_impressions)} icon={TrendingUp} />
            <MiniKPI label="Engagement" value={d.fb_engagement_rate} icon={Heart} suffix="%" />
            <MiniKPI label="Content" value={(d.fb_posts_count || 0) + (d.fb_reels_count || 0) + (d.fb_stories_count || 0)} icon={ImageIcon} />
          </div>

          {/* FB Top Posts */}
          {fbTopPosts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Facebook size={14} className="text-blue-500" />
                Top Posts <span className="text-xs font-normal text-gray-400">by reach</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Post</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Impressions</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Reach</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Reactions</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600 hidden sm:table-cell">Clicks</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Eng%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fbTopPosts.slice(0, 10).map((p, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.published}</td>
                        <td className="px-3 py-2 text-gray-800 max-w-[200px] truncate" title={p.title}>{p.title}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatNum(p.impressions)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium">{formatNum(p.reach)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatNum(p.reactions)}</td>
                        <td className="px-3 py-2 text-right tabular-nums hidden sm:table-cell">{formatNum(p.clicks)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium text-blue-600">{p.engagement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FB Demographics */}
          {(fbDemographics.countries?.length > 0 || fbDemographics.cities?.length > 0) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users size={14} className="text-blue-500" />
                Page Demographics
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {fbDemographics.countries?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Top Countries</p>
                    <div className="space-y-2">
                      {fbDemographics.countries.slice(0, 7).map((c, i) => (
                        <PercentBar key={i} label={c.name} value={c.pct} maxValue={fbDemographics.countries[0].pct} />
                      ))}
                    </div>
                  </div>
                )}
                {fbDemographics.cities?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Top Cities</p>
                    <div className="space-y-2">
                      {fbDemographics.cities.slice(0, 7).map((c, i) => (
                        <PercentBar key={i} label={c.name} value={c.pct} maxValue={fbDemographics.cities[0].pct} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
