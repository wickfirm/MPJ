'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ChevronDown, ChevronRight, Download, BarChart3, Calendar, TrendingUp, Megaphone, ExternalLink, Users, Lightbulb } from 'lucide-react'
import { LineChart as ReLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#76527c', '#d8ee91', '#D0E4E7', '#9f7aea', '#68d391', '#fc8181']
const formatNum = (n) => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'
const formatInt = (n) => n?.toLocaleString('en-US') || '0'
const formatK = (n) => n >= 1000000 ? (n/1000000).toFixed(1) + 'M' : n >= 1000 ? (n/1000).toFixed(0) + 'K' : n

const CollapsibleSection = ({ title, children, defaultOpen = true, color = '#76527c' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-4 flex items-center justify-between text-white font-semibold rounded-t-lg" style={{ backgroundColor: color }}>
        <span>{title}</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  )
}

const AudienceTag = ({ items, color }) => (
  <div className="flex flex-wrap gap-1">
    {items?.map((item, i) => (
      <span key={i} className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: color, color: '#333' }}>{item}</span>
    ))}
  </div>
)

const AdSetRow = ({ adSet, isExpanded, onToggle }) => (
  <>
    <tr className="border-t">
      <td className="px-3 py-2">
        <button onClick={onToggle} className="flex items-center gap-2 font-medium hover:text-purple-700">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {adSet.name}
        </button>
      </td>
      <td className="px-3 py-2 text-right">{formatInt(adSet.impressions)}</td>
      <td className="px-3 py-2 text-right">{formatInt(adSet.clicks)}</td>
      <td className="px-3 py-2 text-right">{adSet.ctr}</td>
      <td className="px-3 py-2 text-right">{formatInt(adSet.linkClicks)}</td>
      <td className="px-3 py-2 text-right">{formatInt(adSet.engagement)}</td>
    </tr>
    {isExpanded && adSet.audience && (
      <tr className="bg-gray-50">
        <td colSpan={6} className="px-6 py-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-700 flex items-center gap-1 mb-1"><Users size={14} /> Location</p>
                <p className="text-gray-600">{adSet.audience.location}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Demographics</p>
                <p className="text-gray-600">Age: {adSet.audience.age} | Gender: {adSet.audience.gender}</p>
                {adSet.audience.demographics?.length > 0 && <div className="mt-1"><AudienceTag items={adSet.audience.demographics} color="#D0E4E7" /></div>}
              </div>
            </div>
            <div className="space-y-3">
              {adSet.audience.interests?.length > 0 && <div><p className="font-semibold text-gray-700 mb-1">Interests</p><AudienceTag items={adSet.audience.interests} color="#d8ee91" /></div>}
              {adSet.audience.behaviors?.length > 0 && <div><p className="font-semibold text-gray-700 mb-1">Behaviors</p><AudienceTag items={adSet.audience.behaviors} color="#faf089" /></div>}
            </div>
          </div>
        </td>
      </tr>
    )}
  </>
)

const SLA_DATA = [
  { type: 'Monthly Report – GM', timeline: '5 working days after receiving the 7rooms report once the month is over' },
  { type: 'Monthly Report – Internal', timeline: '5 working days after receiving the 7rooms report once the month is over' },
  { type: 'Weekly Report', timeline: '2 working days after receiving the 7rooms report. For Thursday meetings, reports must be sent by Monday 10 AM' },
  { type: 'Influencer Report', timeline: '7 working days after the influencer launches the campaign, to allow time for content reach' },
  { type: 'AEO/SEO Report', timeline: '3-5 working days once the month is over' },
  { type: 'Influencer Media Plans', timeline: '3-5 working days depending on seasonality and number of influencers' },
  { type: 'Online/Offline Media Plans', timeline: '3-5 working days depending on seasonality, number of verticals, and budget' }
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('workspace')
  const [venues, setVenues] = useState([])
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [weeklyReports, setWeeklyReports] = useState({})
  const [liveCampaigns, setLiveCampaigns] = useState({})
  const [workspaceData, setWorkspaceData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedAdSets, setExpandedAdSets] = useState({})
  const [liveCampaignVenue, setLiveCampaignVenue] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch venues
      const { data: venuesData } = await supabase.from('venues').select('*').order('name')
      setVenues(venuesData || [])
      if (venuesData?.length > 0) {
        setSelectedVenue(venuesData[0].name)
        setLiveCampaignVenue(venuesData[0].name)
      }

      // Fetch weekly reports
      const { data: reportsData } = await supabase.from('weekly_reports').select('*, venues(name, poc)')
      const reportsMap = {}
      reportsData?.forEach(r => {
        if (r.venues?.name) reportsMap[r.venues.name] = { ...r, poc: r.venues.poc }
      })
      setWeeklyReports(reportsMap)

      // Fetch live campaigns
      const { data: campaignsData } = await supabase.from('live_campaigns').select('*, venues(name)')
      const campaignsMap = {}
      campaignsData?.forEach(c => {
        if (c.venues?.name) {
          if (!campaignsMap[c.venues.name]) campaignsMap[c.venues.name] = []
          campaignsMap[c.venues.name].push(c)
        }
      })
      setLiveCampaigns(campaignsMap)

      // Fetch workspace
      const { data: workspaceRaw } = await supabase.from('workspace_budgets').select('*').order('brand')
      setWorkspaceData(workspaceRaw || [])

      // Fetch monthly rollups
      const { data: monthlyRaw } = await supabase.from('monthly_rollups').select('*').order('month')
      setMonthlyData(monthlyRaw || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdSet = (name) => setExpandedAdSets(prev => ({ ...prev, [name]: !prev[name] }))

  const sortByImpressions = (arr) => {
    if (!arr || !Array.isArray(arr)) return []
    return [...arr].sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
  }

  const getVenueData = (venueName) => {
    const venue = venues.find(v => v.name === venueName)
    const report = weeklyReports[venueName]
    
    // Sort meta data by impressions
    const sortedMeta = report?.meta_data ? {
      campaigns: sortByImpressions(report.meta_data.campaigns),
      adSets: sortByImpressions(report.meta_data.adSets),
      ads: sortByImpressions(report.meta_data.ads),
      analysis: report.meta_data.analysis
    } : { campaigns: [], adSets: [], ads: [], analysis: null }

    return {
      ...venue,
      weekStart: report?.week_start,
      weekEnd: report?.week_end,
      adSpend: report?.ad_spend || 0,
      meta: sortedMeta,
      revenue: report?.revenue_data,
      programmatic: report?.programmatic_data,
      liveCampaigns: liveCampaigns[venueName] || [],
      poc: report?.poc || venue?.poc
    }
  }

  const calcROAS = (d) => (!d?.revenue || !d?.adSpend) ? '0x' : (d.revenue.totalOnline / d.adSpend).toFixed(2) + 'x'
  const calcOnlinePercent = (d) => {
    if (!d?.revenue) return { rev: '0%', res: '0%' }
    return { rev: ((d.revenue.totalOnline / d.revenue.totalBusiness) * 100).toFixed(2) + '%', res: ((d.revenue.onlineReservations / d.revenue.totalReservations) * 100).toFixed(2) + '%' }
  }
  const calcAvgSpend = (rev, res) => res > 0 ? (rev / res).toFixed(2) : '0.00'

  const exportToCSV = () => {
    let csv = 'Venue,Ad Spend,Total Revenue,Online Revenue,ROAS,Reservations\n'
    venues.forEach(v => {
      const d = getVenueData(v.name)
      csv += `${v.name},${d.adSpend},${d.revenue?.totalBusiness || 0},${d.revenue?.totalOnline || 0},${calcROAS(d)},${d.revenue?.totalReservations || 0}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'mpj-report.csv'; a.click()
  }

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Calendar },
    { id: 'executive', label: 'Executive Summary', icon: TrendingUp },
    { id: 'venue', label: 'Venue View', icon: BarChart3 },
    { id: 'live', label: 'Live Campaigns', icon: Megaphone }
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>

  const data = selectedVenue ? getVenueData(selectedVenue) : null
  const allVenuesSpend = venues.map(v => ({ name: v.name.substring(0, 10), spend: getVenueData(v.name).adSpend }))
  const spendByPOC = venues.reduce((acc, v) => { acc[v.poc] = (acc[v.poc] || 0) + (getVenueData(v.name).adSpend || 0); return acc }, {})
  const pocPieData = Object.entries(spendByPOC).map(([name, value]) => ({ name, value }))
  const totalAdSpend = venues.reduce((s, v) => s + (getVenueData(v.name).adSpend || 0), 0)
  const totalRevenue = venues.reduce((s, v) => s + (getVenueData(v.name).revenue?.totalBusiness || 0), 0)
  const totalReservations = venues.reduce((s, v) => s + (getVenueData(v.name).revenue?.totalReservations || 0), 0)

  // Get POC for workspace brands
  const getBrandPOC = (brandName) => {
    const venueName = brandName.replace(' Media', '')
    const venue = venues.find(v => v.name === venueName)
    return venue?.poc || '-'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div style={{ backgroundColor: '#76527c' }} className="text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold">MPJ F&Bs Performance Dashboard</h1>
            <p className="text-sm opacity-80">Marriott Palm Jumeirah Weekly Reports</p>
          </div>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded hover:bg-white/30 text-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex gap-1 px-6 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === tab.id ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* WORKSPACE */}
        {activeTab === 'workspace' && (
          <>
            <CollapsibleSection title="Budget Workspace - All Brands">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr><th className="text-left px-2 py-2">Brand</th><th className="text-left px-2 py-2">POC</th><th className="text-right px-2 py-2">Monthly Budget</th><th className="text-right px-2 py-2">Traffic</th><th className="text-right px-2 py-2">Community</th><th className="text-right px-2 py-2">Total Spend</th><th className="text-right px-2 py-2">Remaining</th><th className="text-right px-2 py-2">% Spent</th></tr>
                  </thead>
                  <tbody>
                    {workspaceData.map((w, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-2 font-medium">{w.brand}</td>
                        <td className="px-2 py-2">{getBrandPOC(w.brand)}</td>
                        <td className="px-2 py-2 text-right">AED {formatNum(w.monthly_budget)}</td>
                        <td className="px-2 py-2 text-right">AED {formatNum(w.traffic)}</td>
                        <td className="px-2 py-2 text-right">AED {formatNum(w.community)}</td>
                        <td className="px-2 py-2 text-right">AED {formatNum(w.total_spend)}</td>
                        <td className={`px-2 py-2 text-right ${w.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>AED {formatNum(w.remaining)}</td>
                        <td className="px-2 py-2 text-right font-medium">{w.pct_spent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="SLA Timelines" color="#4a5568">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr><th className="text-left px-3 py-2">Report Type</th><th className="text-left px-3 py-2">Timeline</th></tr>
                  </thead>
                  <tbody>
                    {SLA_DATA.map((sla, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2 font-medium">{sla.type}</td>
                        <td className="px-3 py-2">{sla.timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 mt-3">*Timelines may shift due to public holidays (e.g., Eid) or country-specific circumstances.</p>
              </div>
            </CollapsibleSection>
          </>
        )}

        {/* EXECUTIVE */}
        {activeTab === 'executive' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow"><p className="text-xs text-gray-500">Total Ad Spend</p><p className="text-2xl font-bold" style={{ color: '#76527c' }}>AED {formatNum(totalAdSpend)}</p></div>
              <div className="bg-white p-4 rounded-lg shadow"><p className="text-xs text-gray-500">Total Revenue</p><p className="text-2xl font-bold" style={{ color: '#76527c' }}>AED {formatNum(totalRevenue)}</p></div>
              <div className="bg-white p-4 rounded-lg shadow"><p className="text-xs text-gray-500">Total Reservations</p><p className="text-2xl font-bold" style={{ color: '#76527c' }}>{formatInt(totalReservations)}</p></div>
              <div className="bg-white p-4 rounded-lg shadow"><p className="text-xs text-gray-500">Combined ROAS</p><p className="text-2xl font-bold" style={{ color: '#76527c' }}>{totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : 0}x</p></div>
            </div>
            <CollapsibleSection title="All Venues Performance">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Venue</th><th className="text-left px-3 py-2">POC</th><th className="text-right px-3 py-2">Ad Spend</th><th className="text-right px-3 py-2">Revenue</th><th className="text-right px-3 py-2">Reservations</th><th className="text-right px-3 py-2">ROAS</th></tr></thead>
                <tbody>
                  {venues.map(v => {
                    const d = getVenueData(v.name)
                    return <tr key={v.id} className="border-t"><td className="px-3 py-2 font-medium">{v.name}</td><td className="px-3 py-2">{v.poc}</td><td className="px-3 py-2 text-right">AED {formatNum(d.adSpend)}</td><td className="px-3 py-2 text-right">AED {formatNum(d.revenue?.totalBusiness || 0)}</td><td className="px-3 py-2 text-right">{formatInt(d.revenue?.totalReservations || 0)}</td><td className="px-3 py-2 text-right">{calcROAS(d)}</td></tr>
                  })}
                </tbody>
              </table>
            </CollapsibleSection>
            {monthlyData.length > 0 && (
              <CollapsibleSection title="Monthly Rollup" color="#4a5568">
                <div className="grid md:grid-cols-2 gap-6">
                  <div><h4 className="text-sm font-semibold mb-3">Ad Spend vs Revenue</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={formatK} /><Tooltip formatter={(v) => formatK(v)} /><Legend /><Bar dataKey="ad_spend" fill="#76527c" name="Ad Spend" /><Bar dataKey="revenue" fill="#d8ee91" name="Revenue" /></BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div><h4 className="text-sm font-semibold mb-3">Reservations Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <ReLineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="reservations" stroke="#76527c" strokeWidth={3} /></ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CollapsibleSection>
            )}
            <CollapsibleSection title="Visual Trends" color="#2d3748">
              <div className="grid md:grid-cols-2 gap-6">
                <div><h4 className="text-sm font-semibold mb-3">Ad Spend by Venue</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={allVenuesSpend} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tickFormatter={formatK} /><YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => 'AED ' + formatNum(v)} /><Bar dataKey="spend" fill="#76527c" /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div><h4 className="text-sm font-semibold mb-3">Spend by POC</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart><Pie data={pocPieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{pocPieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => 'AED ' + formatNum(v)} /></PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}

        {/* VENUE VIEW */}
        {activeTab === 'venue' && data && (
          <>
            <div className="mb-6 flex items-center gap-4 flex-wrap">
              <select value={selectedVenue} onChange={(e) => setSelectedVenue(e.target.value)} className="px-4 py-2 border rounded font-medium">
                {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
              {data.weekStart && <span className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: '#d8ee91' }}>{data.weekStart} → {data.weekEnd}</span>}
              <span className="text-sm text-gray-600">POC: <strong>{data.poc}</strong></span>
            </div>

            {data.meta?.analysis && (
              <CollapsibleSection title="Analysis & Recommendations" color="#2563eb">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                        <p className="text-gray-700 text-sm">{data.meta.analysis.summary}</p>
                      </div>
                    </div>
                  </div>
                  {data.meta.analysis.recommendations?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {data.meta.analysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600 font-bold">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {data.meta?.campaigns?.length > 0 && (
              <CollapsibleSection title="Meta Ads Performance">
                <div className="space-y-6">
                  <div><h4 className="text-sm font-semibold mb-2">Campaign Level</h4>
                    <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Campaign</th><th className="text-right px-3 py-2">Impressions</th><th className="text-right px-3 py-2">Clicks</th><th className="text-right px-3 py-2">CTR</th><th className="text-right px-3 py-2">Link Clicks</th><th className="text-right px-3 py-2">Engagement</th></tr></thead>
                      <tbody>{data.meta.campaigns.map((c, i) => <tr key={i} className="border-t"><td className="px-3 py-2">{c.name}</td><td className="px-3 py-2 text-right">{formatInt(c.impressions)}</td><td className="px-3 py-2 text-right">{formatInt(c.clicks)}</td><td className="px-3 py-2 text-right">{c.ctr}</td><td className="px-3 py-2 text-right">{formatInt(c.linkClicks)}</td><td className="px-3 py-2 text-right">{formatInt(c.engagement)}</td></tr>)}</tbody>
                    </table>
                  </div>
                  {data.meta.adSets?.length > 0 && (
                    <div><h4 className="text-sm font-semibold mb-2">Ad Set Level <span className="text-xs font-normal text-gray-500">(click to view audience)</span></h4>
                      <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Ad Set</th><th className="text-right px-3 py-2">Impressions</th><th className="text-right px-3 py-2">Clicks</th><th className="text-right px-3 py-2">CTR</th><th className="text-right px-3 py-2">Link Clicks</th><th className="text-right px-3 py-2">Engagement</th></tr></thead>
                        <tbody>{data.meta.adSets.map((a) => <AdSetRow key={a.name} adSet={a} isExpanded={expandedAdSets[a.name]} onToggle={() => toggleAdSet(a.name)} />)}</tbody>
                      </table>
                    </div>
                  )}
                  {data.meta.ads?.length > 0 && (
                    <div><h4 className="text-sm font-semibold mb-2">Ad Level</h4>
                      <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Ad Name</th><th className="text-right px-3 py-2">Impressions</th><th className="text-right px-3 py-2">CTR</th><th className="text-right px-3 py-2">Link Clicks</th><th className="text-right px-3 py-2">Engagement</th></tr></thead>
                        <tbody>{data.meta.ads.map((a, i) => <tr key={i} className="border-t"><td className="px-3 py-2 max-w-xs truncate">{a.name}</td><td className="px-3 py-2 text-right">{formatInt(a.impressions)}</td><td className="px-3 py-2 text-right">{a.ctr}</td><td className="px-3 py-2 text-right">{formatInt(a.linkClicks)}</td><td className="px-3 py-2 text-right">{formatInt(a.engagement)}</td></tr>)}</tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {data.revenue && (
              <CollapsibleSection title="Revenue & Reservations (7rooms)">
                <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-3 py-2 w-36">Category</th><th className="text-left px-3 py-2">Metric / Channel</th><th className="text-right px-3 py-2">Revenue (AED)</th><th className="text-right px-3 py-2">Reservations</th><th className="text-right px-3 py-2">Avg. Spend/Res</th></tr></thead>
                  <tbody>
                    <tr className="border-t bg-gray-50"><td className="px-3 py-2 font-semibold" style={{ color: '#76527c' }}>Overall Metrics</td><td className="px-3 py-2">Total Business</td><td className="px-3 py-2 text-right font-medium">{formatNum(data.revenue.totalBusiness)}</td><td className="px-3 py-2 text-right font-medium">{formatInt(data.revenue.totalReservations)}</td><td className="px-3 py-2 text-right">{calcAvgSpend(data.revenue.totalBusiness, data.revenue.totalReservations)}</td></tr>
                    <tr className="border-t"><td></td><td className="px-3 py-2">Total Online (Combined)</td><td className="px-3 py-2 text-right">{formatNum(data.revenue.totalOnline)}</td><td className="px-3 py-2 text-right">{formatInt(data.revenue.onlineReservations)}</td><td className="px-3 py-2 text-right">{calcAvgSpend(data.revenue.totalOnline, data.revenue.onlineReservations)}</td></tr>
                    <tr className="border-t"><td></td><td className="px-3 py-2">% of Total (Online)</td><td className="px-3 py-2 text-right">{calcOnlinePercent(data).rev}</td><td className="px-3 py-2 text-right">{calcOnlinePercent(data).res}</td><td className="px-3 py-2 text-right">—</td></tr>
                    <tr className="border-t bg-gray-50"><td className="px-3 py-2 font-semibold" style={{ color: '#76527c' }}>Marketing</td><td className="px-3 py-2">Ad Spend</td><td className="px-3 py-2 text-right font-medium">{formatNum(data.adSpend)}</td><td className="px-3 py-2 text-right">—</td><td className="px-3 py-2 text-right">—</td></tr>
                    <tr className="border-t"><td></td><td className="px-3 py-2">ROAS</td><td className="px-3 py-2 text-right font-medium">{calcROAS(data)}</td><td className="px-3 py-2 text-right">—</td><td className="px-3 py-2 text-right">—</td></tr>
                    {data.revenue.channels && Object.entries(data.revenue.channels).map(([ch, v], i) => <tr key={ch} className={`border-t ${i === 0 ? 'bg-gray-50' : ''}`}><td className="px-3 py-2 font-semibold" style={{ color: '#76527c' }}>{i === 0 ? 'Online Channels' : ''}</td><td className="px-3 py-2">{ch}</td><td className="px-3 py-2 text-right">{formatNum(v.revenue)}</td><td className="px-3 py-2 text-right">{v.reservations}</td><td className="px-3 py-2 text-right">{calcAvgSpend(v.revenue, v.reservations)}</td></tr>)}
                    {data.revenue.offline && Object.entries(data.revenue.offline).map(([ch, v], i) => <tr key={ch} className={`border-t ${i === 0 ? 'bg-gray-50' : ''}`}><td className="px-3 py-2 font-semibold" style={{ color: '#76527c' }}>{i === 0 ? 'Offline / Internal' : ''}</td><td className="px-3 py-2">{ch}</td><td className="px-3 py-2 text-right">{formatNum(v.revenue)}</td><td className="px-3 py-2 text-right">{v.reservations}</td><td className="px-3 py-2 text-right">{calcAvgSpend(v.revenue, v.reservations)}</td></tr>)}
                  </tbody>
                </table>
              </CollapsibleSection>
            )}

            {data.programmatic && (
              <CollapsibleSection title="Programmatic Performance" color="#4a5568">
                <table className="w-full text-sm mb-4"><thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Creative File</th><th className="text-left px-3 py-2">Format</th><th className="text-left px-3 py-2">Size</th><th className="text-right px-3 py-2">Impressions</th><th className="text-right px-3 py-2">Clicks</th><th className="text-right px-3 py-2">CTR %</th></tr></thead>
                  <tbody>
                    {data.programmatic.creatives?.map((c, i) => <tr key={i} className="border-t"><td className="px-3 py-2">{c.file}</td><td className="px-3 py-2">{c.format}</td><td className="px-3 py-2">{c.size}</td><td className="px-3 py-2 text-right">{formatInt(c.impressions)}</td><td className="px-3 py-2 text-right">{formatInt(c.clicks)}</td><td className="px-3 py-2 text-right">{c.ctr}</td></tr>)}
                    {data.programmatic.totals && <tr className="border-t bg-gray-100 font-semibold"><td className="px-3 py-2">TOTALS</td><td></td><td></td><td className="px-3 py-2 text-right">{formatInt(data.programmatic.totals.impressions)}</td><td className="px-3 py-2 text-right">{formatInt(data.programmatic.totals.clicks)}</td><td className="px-3 py-2 text-right">{data.programmatic.totals.ctr}</td></tr>}
                  </tbody>
                </table>
                {data.programmatic.viewability && <p className="text-sm text-gray-600">Viewability: <strong>{data.programmatic.viewability}</strong> | VTR: <strong>{data.programmatic.vtr}</strong></p>}
              </CollapsibleSection>
            )}

            {data.liveCampaigns?.length > 0 && (
              <CollapsibleSection title={`Live Campaigns - ${selectedVenue}`} color="#9333ea">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: '#D0E4E7' }}>
                      <tr><th className="text-left px-3 py-2">Type</th><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Language</th><th className="text-left px-3 py-2">Format</th><th className="text-left px-3 py-2">Captions?</th><th className="text-left px-3 py-2">Landing Page</th><th className="text-left px-3 py-2">Status</th></tr>
                    </thead>
                    <tbody>
                      {data.liveCampaigns.map((c, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-xs font-medium text-white ${(c.type === 'Dark Post' || c.type === 'Dark') ? 'bg-blue-500' : 'bg-pink-400'}`}>{c.type === 'Dark' ? 'Dark Post' : c.type}</span></td>
                          <td className="px-3 py-2 font-medium">{c.name}</td>
                          <td className="px-3 py-2">{c.language}</td>
                          <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-xs ${c.format === 'Carousel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{c.format}</span></td>
                          <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-xs ${c.captions === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.captions}</span></td>
                          <td className="px-3 py-2">{c.landing_page?.startsWith('http') ? <a href={c.landing_page} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">{c.landing_page.replace('https://', '').substring(0, 20)}... <ExternalLink size={12} /></a> : <span className="text-gray-500">{c.landing_page}</span>}</td>
                          <td className="px-3 py-2"><span className="px-2 py-1 rounded text-xs font-bold bg-green-500 text-white">{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
            )}
          </>
        )}

        {/* LIVE CAMPAIGNS */}
        {activeTab === 'live' && (
          <>
            <div className="mb-6">
              <select value={liveCampaignVenue} onChange={(e) => setLiveCampaignVenue(e.target.value)} className="px-4 py-2 border rounded font-medium">
                {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <CollapsibleSection title={`Live Campaigns - ${liveCampaignVenue}`}>
              {liveCampaigns[liveCampaignVenue]?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: '#D0E4E7' }}>
                      <tr><th className="text-left px-3 py-2">Type</th><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Language</th><th className="text-left px-3 py-2">Format</th><th className="text-left px-3 py-2">Captions?</th><th className="text-left px-3 py-2">Landing Page</th><th className="text-left px-3 py-2">Status</th></tr>
                    </thead>
                    <tbody>
                      {liveCampaigns[liveCampaignVenue].map((c, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-xs font-medium text-white ${(c.type === 'Dark Post' || c.type === 'Dark') ? 'bg-blue-500' : 'bg-pink-400'}`}>{c.type === 'Dark' ? 'Dark Post' : c.type}</span></td>
                          <td className="px-3 py-2 font-medium">{c.name}</td>
                          <td className="px-3 py-2">{c.language}</td>
                          <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-xs ${c.format === 'Carousel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{c.format}</span></td>
                          <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-xs ${c.captions === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.captions}</span></td>
                          <td className="px-3 py-2">{c.landing_page?.startsWith('http') ? <a href={c.landing_page} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">{c.landing_page.replace('https://', '').substring(0, 20)}... <ExternalLink size={12} /></a> : <span className="text-gray-500">{c.landing_page}</span>}</td>
                          <td className="px-3 py-2"><span className="px-2 py-1 rounded text-xs font-bold bg-green-500 text-white">{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No live campaigns for this venue</p>
              )}
            </CollapsibleSection>
          </>
        )}

        <div className="mt-6 text-center text-xs text-gray-400">Made by MB with ❤️</div>
      </div>
    </div>
  )
}
