'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, BarChart3, Calendar, TrendingUp, Megaphone, ExternalLink, Users, Lightbulb, RefreshCw, LogOut, DollarSign, ShoppingBag, Target } from 'lucide-react'
import { LineChart as ReLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

import CollapsibleSection from './components/CollapsibleSection'
import DeltaBadge from './components/DeltaBadge'
import KPICard from './components/KPICard'
import AdSetRow from './components/AdSetRow'
import Toast from './components/Toast'
import ErrorState from './components/ErrorState'
import { DashboardSkeleton } from './components/SkeletonLoader'

// ── Constants ────────────────────────────────
const COLORS = ['#76527c', '#d8ee91', '#D0E4E7', '#9f7aea', '#68d391', '#fc8181']
const AUTO_REFRESH_MS = 5 * 60 * 1000 // 5 minutes

const SLA_DATA = [
  { type: 'Monthly Report - GM', timeline: '5 working days after receiving the 7rooms report once the month is over' },
  { type: 'Monthly Report - Internal', timeline: '5 working days after receiving the 7rooms report once the month is over' },
  { type: 'Weekly Report', timeline: '2 working days after receiving the 7rooms report. For Thursday meetings, reports must be sent by Monday 10 AM' },
  { type: 'Influencer Report', timeline: '7 working days after the influencer launches the campaign, to allow time for content reach' },
  { type: 'AEO/SEO Report', timeline: '3-5 working days once the month is over' },
  { type: 'Influencer Media Plans', timeline: '3-5 working days depending on seasonality and number of influencers' },
  { type: 'Online/Offline Media Plans', timeline: '3-5 working days depending on seasonality, number of verticals, and budget' }
]

// ── Helpers ──────────────────────────────────
const formatNum = (n) => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'
const formatInt = (n) => n?.toLocaleString('en-US') || '0'
const formatK = (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n
const calcAvgSpend = (rev, res) => res > 0 ? (rev / res).toFixed(2) : '0.00'

// ── Main Dashboard ───────────────────────────
export default function Dashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Data state
  const [activeTab, setActiveTab] = useState('workspace')
  const [venues, setVenues] = useState([])
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [previousWeek, setPreviousWeek] = useState(null)
  const [weeklyReports, setWeeklyReports] = useState({})
  const [allWeeks, setAllWeeks] = useState([])
  const [liveCampaigns, setLiveCampaigns] = useState({})
  const [workspaceData, setWorkspaceData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [expandedAdSets, setExpandedAdSets] = useState({})
  const [liveCampaignVenue, setLiveCampaignVenue] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [toast, setToast] = useState(null)

  // ── Auth check ───────────────────────────
  useEffect(() => {
    const auth = sessionStorage.getItem('mpj_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      window.location.href = '/login'
    }
    setAuthChecked(true)
  }, [])

  // ── Data fetching ────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    if (!isRefresh) setLoading(true)
    setError(null)

    try {
      const [venuesRes, reportsRes, campaignsRes, workspaceRes, monthlyRes] = await Promise.all([
        supabase.from('venues').select('*').order('name'),
        supabase.from('weekly_reports').select('*, venues(name, poc)').order('week_end', { ascending: false }),
        supabase.from('live_campaigns').select('*, venues(name)'),
        supabase.from('workspace_budgets').select('*').order('brand'),
        supabase.from('monthly_rollups').select('*').order('month'),
      ])

      // Check for errors
      const errors = [venuesRes, reportsRes, campaignsRes, workspaceRes, monthlyRes]
        .filter(r => r.error)
        .map(r => r.error.message)

      if (errors.length > 0) {
        throw new Error(errors.join('; '))
      }

      // Process venues
      const venuesData = venuesRes.data || []
      setVenues(venuesData)
      if (venuesData.length > 0 && !selectedVenue) {
        setSelectedVenue(venuesData[0].name)
        setLiveCampaignVenue(venuesData[0].name)
      }

      // Process weekly reports
      const reportsMap = {}
      const weeksSet = new Set()
      reportsRes.data?.forEach(r => {
        if (r.venues?.name) {
          const weekKey = `${r.week_start}_${r.week_end}`
          weeksSet.add(weekKey)
          if (!reportsMap[r.venues.name]) reportsMap[r.venues.name] = {}
          reportsMap[r.venues.name][weekKey] = { ...r, poc: r.venues.poc }
        }
      })
      setWeeklyReports(reportsMap)

      const weeksArray = Array.from(weeksSet).map(wk => {
        const [start, end] = wk.split('_')
        return { key: wk, start, end, label: `${start} → ${end}` }
      }).sort((a, b) => new Date(b.end) - new Date(a.end))

      setAllWeeks(weeksArray)
      if (weeksArray.length > 0 && !selectedWeek) {
        setSelectedWeek(weeksArray[0].key)
        if (weeksArray.length > 1) setPreviousWeek(weeksArray[1].key)
      }

      // Process live campaigns
      const campaignsMap = {}
      campaignsRes.data?.forEach(c => {
        if (c.venues?.name) {
          if (!campaignsMap[c.venues.name]) campaignsMap[c.venues.name] = []
          campaignsMap[c.venues.name].push(c)
        }
      })
      setLiveCampaigns(campaignsMap)

      // Workspace + Monthly
      setWorkspaceData(workspaceRes.data || [])
      setMonthlyData(monthlyRes.data || [])
      setLastUpdated(new Date())

      if (isRefresh) {
        setToast({ message: 'Data refreshed successfully', type: 'success' })
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load dashboard data')
      if (isRefresh) {
        setToast({ message: 'Failed to refresh data', type: 'error' })
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedVenue, selectedWeek])

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  // Auto-refresh
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => fetchData(true), AUTO_REFRESH_MS)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchData])

  // ── Derived data (memoized) ──────────────
  const sortByImpressions = useCallback((arr) => {
    if (!arr || !Array.isArray(arr)) return []
    return [...arr].sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
  }, [])

  const getVenueData = useCallback((venueName, weekKey) => {
    const venue = venues.find(v => v.name === venueName)
    const report = weeklyReports[venueName]?.[weekKey]

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
  }, [venues, weeklyReports, liveCampaigns, sortByImpressions])

  const currentData = useMemo(() =>
    selectedVenue && selectedWeek ? getVenueData(selectedVenue, selectedWeek) : null
  , [selectedVenue, selectedWeek, getVenueData])

  const previousData = useMemo(() =>
    selectedVenue && previousWeek && compareMode ? getVenueData(selectedVenue, previousWeek) : null
  , [selectedVenue, previousWeek, compareMode, getVenueData])

  const executiveMetrics = useMemo(() => {
    if (!selectedWeek) return { totalAdSpend: 0, totalRevenue: 0, totalReservations: 0, allVenuesSpend: [], pocPieData: [] }

    let totalAdSpend = 0, totalRevenue = 0, totalReservations = 0
    const allVenuesSpend = []
    const spendByPOC = {}

    venues.forEach(v => {
      const d = getVenueData(v.name, selectedWeek)
      totalAdSpend += d.adSpend || 0
      totalRevenue += d.revenue?.totalBusiness || 0
      totalReservations += d.revenue?.totalReservations || 0
      allVenuesSpend.push({ name: v.name.length > 12 ? v.name.substring(0, 12) + '..' : v.name, spend: d.adSpend })
      spendByPOC[v.poc] = (spendByPOC[v.poc] || 0) + (d.adSpend || 0)
    })

    const pocPieData = Object.entries(spendByPOC).map(([name, value]) => ({ name, value }))
    return { totalAdSpend, totalRevenue, totalReservations, allVenuesSpend, pocPieData }
  }, [venues, selectedWeek, getVenueData])

  const calcROAS = (d) => (!d?.revenue || !d?.adSpend) ? '0x' : (d.revenue.totalOnline / d.adSpend).toFixed(2) + 'x'
  const calcOnlinePercent = (d) => {
    if (!d?.revenue) return { rev: '0%', res: '0%' }
    return {
      rev: ((d.revenue.totalOnline / d.revenue.totalBusiness) * 100).toFixed(2) + '%',
      res: ((d.revenue.onlineReservations / d.revenue.totalReservations) * 100).toFixed(2) + '%'
    }
  }

  const getBrandPOC = (brandName) => {
    const venueName = brandName.replace(' Media', '')
    const venue = venues.find(v => v.name === venueName)
    return venue?.poc || '-'
  }

  // ── Actions ────────────────────────────
  const toggleAdSet = (name) => setExpandedAdSets(prev => ({ ...prev, [name]: !prev[name] }))

  const exportToCSV = () => {
    let csv = 'Venue,Week,Ad Spend,Total Revenue,Online Revenue,ROAS,Reservations\n'
    venues.forEach(v => {
      const d = getVenueData(v.name, selectedWeek)
      csv += `${v.name},${d.weekStart} to ${d.weekEnd},${d.adSpend},${d.revenue?.totalBusiness || 0},${d.revenue?.totalOnline || 0},${calcROAS(d)},${d.revenue?.totalReservations || 0}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `mpj-report-${selectedWeek}.csv`; a.click()
    URL.revokeObjectURL(url)
    setToast({ message: 'CSV exported successfully', type: 'success' })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('mpj_auth')
    window.location.href = '/login'
  }

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Calendar },
    { id: 'executive', label: 'Executive Summary', icon: TrendingUp },
    { id: 'venue', label: 'Venue View', icon: BarChart3 },
    { id: 'live', label: 'Live Campaigns', icon: Megaphone }
  ]

  // ── Render guards ──────────────────────
  if (!authChecked) return null
  if (!isAuthenticated) return null
  if (loading) return <DashboardSkeleton />
  if (error && venues.length === 0) return <ErrorState message={error} onRetry={() => fetchData()} />

  // ── Render ─────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ──────────────────────── */}
      <header className="bg-mpj-purple text-white px-4 md:px-6 py-4 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">MPJ F&Bs Performance Dashboard</h1>
            <p className="text-xs md:text-sm text-white/70">
              Marriott Palm Jumeirah Weekly Reports
              {lastUpdated && (
                <span className="ml-2 hidden sm:inline">
                  | Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {allWeeks.length > 1 && (
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                  compareMode ? 'bg-green-500 text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {compareMode ? 'Compare ON' : 'Compare'}
              </button>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 rounded-lg hover:bg-white/25 text-xs md:text-sm cursor-pointer disabled:opacity-50 transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 rounded-lg hover:bg-white/25 text-xs md:text-sm cursor-pointer transition-colors"
              aria-label="Export to CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 rounded-lg hover:bg-white/25 text-xs md:text-sm cursor-pointer transition-colors"
              aria-label="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs ────────────────────────── */}
      <nav className="bg-white border-b sticky top-0 z-30 no-print" aria-label="Dashboard sections">
        <div className="max-w-7xl mx-auto flex gap-0.5 px-4 md:px-6 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-mpj-purple text-mpj-purple'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ─────────────────────── */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">

        {/* WORKSPACE TAB */}
        {activeTab === 'workspace' && (
          <div className="space-y-4 animate-fade-in">
            <CollapsibleSection title="Budget Workspace - All Brands" icon={DollarSign}>
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Brand</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">POC</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Monthly Budget</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Total Spend</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Remaining</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">% Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspaceData.map((w, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-gray-900">{w.brand}</td>
                        <td className="px-3 py-2.5 text-gray-600">{getBrandPOC(w.brand)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(w.monthly_budget)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(w.total_spend)}</td>
                        <td className={`px-3 py-2.5 text-right tabular-nums hidden md:table-cell font-medium ${w.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          AED {formatNum(w.remaining)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold">{w.pct_spent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="SLA Timelines" color="#4a5568" icon={Calendar}>
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Report Type</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SLA_DATA.map((sla, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">{sla.type}</td>
                        <td className="px-3 py-2.5 text-gray-600">{sla.timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-4">*Timelines may shift due to public holidays (e.g., Eid) or country-specific circumstances.</p>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* EXECUTIVE SUMMARY TAB */}
        {activeTab === 'executive' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPICard label="Total Ad Spend" value={formatNum(executiveMetrics.totalAdSpend)} prefix="AED " icon={DollarSign} />
              <KPICard label="Total Revenue" value={formatNum(executiveMetrics.totalRevenue)} prefix="AED " icon={TrendingUp} />
              <KPICard label="Total Reservations" value={formatInt(executiveMetrics.totalReservations)} icon={ShoppingBag} />
              <KPICard label="Combined ROAS" value={executiveMetrics.totalAdSpend > 0 ? (executiveMetrics.totalRevenue / executiveMetrics.totalAdSpend).toFixed(2) : '0'} suffix="x" icon={Target} />
            </div>

            <CollapsibleSection title="All Venues Performance" icon={BarChart3}>
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Venue</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">POC</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Ad Spend</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Revenue</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Reservations</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.map(v => {
                      const d = getVenueData(v.name, selectedWeek)
                      return (
                        <tr key={v.id} className="border-t hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5 font-medium text-gray-900">{v.name}</td>
                          <td className="px-3 py-2.5 text-gray-600 hidden md:table-cell">{v.poc}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(d.adSpend)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(d.revenue?.totalBusiness || 0)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{formatInt(d.revenue?.totalReservations || 0)}</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-mpj-purple">{calcROAS(d)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            {monthlyData.length > 0 && (
              <CollapsibleSection title="Monthly Rollup" color="#4a5568" icon={TrendingUp}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Ad Spend vs Revenue</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={formatK} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                        <Legend />
                        <Bar dataKey="ad_spend" fill="#76527c" name="Ad Spend" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="revenue" fill="#d8ee91" name="Revenue" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Reservations Trend</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <ReLineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="reservations" stroke="#76527c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Visual Trends" color="#2d3748" icon={BarChart3}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Ad Spend by Venue</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={executiveMetrics.allVenuesSpend} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tickFormatter={formatK} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                      <Bar dataKey="spend" fill="#76527c" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Spend by POC</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={executiveMetrics.pocPieData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        {executiveMetrics.pocPieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* VENUE VIEW TAB */}
        {activeTab === 'venue' && currentData && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 flex-wrap bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-[180px]">
                <label htmlFor="venue-select" className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
                <select
                  id="venue-select"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple cursor-pointer"
                >
                  {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="week-select" className="block text-xs font-medium text-gray-500 mb-1">Reporting Week</label>
                <select
                  id="week-select"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple cursor-pointer"
                >
                  {allWeeks.map(w => <option key={w.key} value={w.key}>{w.label}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-0.5">
                <span className="text-xs text-gray-500">POC: <strong className="text-mpj-purple">{currentData.poc}</strong></span>
              </div>
            </div>

            {compareMode && previousData && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-slide-down">
                <h3 className="font-semibold text-blue-900 mb-3 text-sm">Period Comparison</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Ad Spend</p>
                    <p className="font-semibold text-gray-900">AED {formatNum(currentData.adSpend)}</p>
                    <DeltaBadge current={currentData.adSpend} previous={previousData.adSpend} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Impressions</p>
                    <p className="font-semibold text-gray-900">{formatInt(currentData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0))}</p>
                    <DeltaBadge current={currentData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0)} previous={previousData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0)} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Revenue</p>
                    <p className="font-semibold text-gray-900">AED {formatNum(currentData.revenue?.totalBusiness || 0)}</p>
                    <DeltaBadge current={currentData.revenue?.totalBusiness || 0} previous={previousData.revenue?.totalBusiness || 0} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Reservations</p>
                    <p className="font-semibold text-gray-900">{formatInt(currentData.revenue?.totalReservations || 0)}</p>
                    <DeltaBadge current={currentData.revenue?.totalReservations || 0} previous={previousData.revenue?.totalReservations || 0} />
                  </div>
                </div>
              </div>
            )}

            {currentData.meta?.analysis && (
              <CollapsibleSection title="Analysis & Recommendations" color="#2563eb" icon={Lightbulb}>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lightbulb size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1.5 text-sm">Summary</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{currentData.meta.analysis.summary}</p>
                      </div>
                    </div>
                  </div>
                  {currentData.meta.analysis.recommendations?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Recommendations</h4>
                      <ul className="space-y-2">
                        {currentData.meta.analysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-gray-50 px-3 py-2.5 rounded-lg">
                            <span className="text-mpj-purple font-bold text-lg leading-none mt-0.5">-</span>
                            <span className="leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {currentData.meta?.campaigns?.length > 0 && (
              <CollapsibleSection title="Meta Ads Performance" icon={Megaphone}>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Campaign Level</h4>
                    <div className="table-responsive">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Campaign</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Clicks</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Link Clicks</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Engagement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.meta.campaigns.map((c, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                              <td className="px-3 py-2.5 font-medium max-w-[200px] truncate">{c.name}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.impressions)}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.clicks)}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums">{c.ctr}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(c.linkClicks)}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(c.engagement)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {currentData.meta.adSets?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Ad Set Level <span className="text-xs font-normal text-gray-400">(click to view audience)</span>
                      </h4>
                      <div className="table-responsive">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Ad Set</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Clicks</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Link Clicks</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Engagement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentData.meta.adSets.map((a) => (
                              <AdSetRow key={a.name} adSet={a} isExpanded={expandedAdSets[a.name]} onToggle={() => toggleAdSet(a.name)} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {currentData.meta.ads?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Ad Level</h4>
                      <div className="table-responsive">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Ad Name</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Link Clicks</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Engagement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentData.meta.ads.map((a, i) => (
                              <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                                <td className="px-3 py-2.5 max-w-[200px] truncate font-medium">{a.name}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(a.impressions)}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums">{a.ctr}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(a.linkClicks)}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(a.engagement)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {currentData.revenue && (
              <CollapsibleSection title="Revenue & Reservations (7rooms)" icon={DollarSign}>
                <div className="table-responsive">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 w-32">Category</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Metric / Channel</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Revenue (AED)</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Reservations</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Avg. Spend</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t bg-gray-50/80">
                        <td className="px-3 py-2.5 font-semibold text-mpj-purple">Overall</td>
                        <td className="px-3 py-2.5">Total Business</td>
                        <td className="px-3 py-2.5 text-right font-medium tabular-nums">{formatNum(currentData.revenue.totalBusiness)}</td>
                        <td className="px-3 py-2.5 text-right font-medium tabular-nums hidden sm:table-cell">{formatInt(currentData.revenue.totalReservations)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(currentData.revenue.totalBusiness, currentData.revenue.totalReservations)}</td>
                      </tr>
                      <tr className="border-t">
                        <td></td>
                        <td className="px-3 py-2.5">Total Online</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{formatNum(currentData.revenue.totalOnline)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{formatInt(currentData.revenue.onlineReservations)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(currentData.revenue.totalOnline, currentData.revenue.onlineReservations)}</td>
                      </tr>
                      <tr className="border-t">
                        <td></td>
                        <td className="px-3 py-2.5">% of Total (Online)</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{calcOnlinePercent(currentData).rev}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{calcOnlinePercent(currentData).res}</td>
                        <td className="px-3 py-2.5 text-right hidden md:table-cell">--</td>
                      </tr>
                      <tr className="border-t bg-gray-50/80">
                        <td className="px-3 py-2.5 font-semibold text-mpj-purple">Marketing</td>
                        <td className="px-3 py-2.5">Ad Spend</td>
                        <td className="px-3 py-2.5 text-right font-medium tabular-nums">{formatNum(currentData.adSpend)}</td>
                        <td className="px-3 py-2.5 text-right hidden sm:table-cell">--</td>
                        <td className="px-3 py-2.5 text-right hidden md:table-cell">--</td>
                      </tr>
                      <tr className="border-t">
                        <td></td>
                        <td className="px-3 py-2.5">ROAS</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-mpj-purple tabular-nums">{calcROAS(currentData)}</td>
                        <td className="px-3 py-2.5 text-right hidden sm:table-cell">--</td>
                        <td className="px-3 py-2.5 text-right hidden md:table-cell">--</td>
                      </tr>
                      {currentData.revenue.channels && Object.entries(currentData.revenue.channels).map(([ch, v], i) => (
                        <tr key={ch} className={`border-t ${i === 0 ? 'bg-gray-50/80' : ''}`}>
                          <td className="px-3 py-2.5 font-semibold text-mpj-purple">{i === 0 ? 'Online' : ''}</td>
                          <td className="px-3 py-2.5">{ch}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatNum(v.revenue)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{v.reservations}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(v.revenue, v.reservations)}</td>
                        </tr>
                      ))}
                      {currentData.revenue.offline && Object.entries(currentData.revenue.offline).map(([ch, v], i) => (
                        <tr key={ch} className={`border-t ${i === 0 ? 'bg-gray-50/80' : ''}`}>
                          <td className="px-3 py-2.5 font-semibold text-mpj-purple">{i === 0 ? 'Offline' : ''}</td>
                          <td className="px-3 py-2.5">{ch}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatNum(v.revenue)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{v.reservations}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(v.revenue, v.reservations)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
            )}

            {currentData.programmatic && (
              <CollapsibleSection title="Programmatic Performance" color="#4a5568" icon={Target}>
                <div className="table-responsive">
                  <table className="w-full text-sm mb-4">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Creative</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Format</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Size</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Clicks</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.programmatic.creatives?.map((c, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5 font-medium truncate max-w-[150px]">{c.file}</td>
                          <td className="px-3 py-2.5 hidden md:table-cell">{c.format}</td>
                          <td className="px-3 py-2.5 hidden md:table-cell">{c.size}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.impressions)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.clicks)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{c.ctr}</td>
                        </tr>
                      ))}
                      {currentData.programmatic.totals && (
                        <tr className="border-t bg-gray-100 font-semibold">
                          <td className="px-3 py-2.5">TOTALS</td>
                          <td className="hidden md:table-cell"></td>
                          <td className="hidden md:table-cell"></td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(currentData.programmatic.totals.impressions)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(currentData.programmatic.totals.clicks)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{currentData.programmatic.totals.ctr}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {currentData.programmatic.viewability && (
                  <div className="flex gap-6 text-sm text-gray-600 mt-2">
                    <span>Viewability: <strong className="text-gray-900">{currentData.programmatic.viewability}</strong></span>
                    <span>VTR: <strong className="text-gray-900">{currentData.programmatic.vtr}</strong></span>
                  </div>
                )}
              </CollapsibleSection>
            )}

            {currentData.liveCampaigns?.length > 0 && (
              <CollapsibleSection title={`Live Campaigns - ${selectedVenue}`} color="#9333ea" icon={Megaphone}>
                <div className="table-responsive">
                  <table className="w-full text-sm">
                    <thead className="bg-mpj-teal/50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Type</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Name</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Language</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Format</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Captions</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.liveCampaigns.map((c, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${(c.type === 'Dark Post' || c.type === 'Dark') ? 'bg-blue-500' : 'bg-pink-400'}`}>
                              {c.type === 'Dark' ? 'Dark Post' : c.type}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-medium">{c.name}</td>
                          <td className="px-3 py-2.5 hidden sm:table-cell">{c.language}</td>
                          <td className="px-3 py-2.5 hidden md:table-cell">
                            <span className={`px-2 py-1 rounded-md text-xs ${c.format === 'Carousel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{c.format}</span>
                          </td>
                          <td className="px-3 py-2.5 hidden md:table-cell">
                            <span className={`px-2 py-1 rounded-md text-xs ${c.captions === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.captions}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-500 text-white">{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
            )}
          </div>
        )}

        {/* LIVE CAMPAIGNS TAB */}
        {activeTab === 'live' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <label htmlFor="live-venue-select" className="block text-xs font-medium text-gray-500 mb-1">Select Venue</label>
              <select
                id="live-venue-select"
                value={liveCampaignVenue}
                onChange={(e) => setLiveCampaignVenue(e.target.value)}
                className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple cursor-pointer"
              >
                {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>

            <CollapsibleSection title={`Live Campaigns - ${liveCampaignVenue}`} icon={Megaphone}>
              {liveCampaigns[liveCampaignVenue]?.length > 0 ? (
                <div className="table-responsive">
                  <table className="w-full text-sm">
                    <thead className="bg-mpj-teal/50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Type</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Name</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Language</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Format</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Captions</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Landing Page</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveCampaigns[liveCampaignVenue].map((c, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${(c.type === 'Dark Post' || c.type === 'Dark') ? 'bg-blue-500' : 'bg-pink-400'}`}>
                              {c.type === 'Dark' ? 'Dark Post' : c.type}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-medium">{c.name}</td>
                          <td className="px-3 py-2.5 hidden sm:table-cell">{c.language}</td>
                          <td className="px-3 py-2.5 hidden md:table-cell">
                            <span className={`px-2 py-1 rounded-md text-xs ${c.format === 'Carousel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{c.format}</span>
                          </td>
                          <td className="px-3 py-2.5 hidden md:table-cell">
                            <span className={`px-2 py-1 rounded-md text-xs ${c.captions === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.captions}</span>
                          </td>
                          <td className="px-3 py-2.5 hidden lg:table-cell">
                            {c.landing_page?.startsWith('http') ? (
                              <a href={c.landing_page} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs truncate max-w-[180px]">
                                {c.landing_page.replace('https://', '').substring(0, 25)}...
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">{c.landing_page || '--'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-500 text-white">{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Megaphone size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No live campaigns for this venue</p>
                </div>
              )}
            </CollapsibleSection>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400 no-print">
          Made by MB
        </div>
      </main>
    </div>
  )
}
